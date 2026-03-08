import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authService, restaurantService } from "../main";
import type { AppContextType, LocationData, User, ICart } from "../types";
import { Toaster, toast } from "react-hot-toast";

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState<LocationData | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [city, setCity] = useState("Fetching Location");

  async function fetchUser() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return; // Don't attempt fetch if no token exists

      const { data } = await axios.get(`${authService}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, // CRITICAL: This allows CORS cookies/headers
      });

      setUser(data);
      setIsAuth(true);
    } catch (error) {
      console.log("Fetch User Error:", error);
      setIsAuth(false); // Reset state on error
    } finally {
      setLoading(false);
    }
  }

  const [cart, setCart] = useState<ICart[]>([]);
  const [subTotal, setSubTotal] = useState(0);
  const [quantity, setQuantity] = useState(0);

  async function fetchCart() {
    if (!user || user.role !== "customer") return;

    try {
      const { data } = await axios.get(`${restaurantService}api/cart/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCart(data.cart || []);
      setSubTotal(data.subTotal || data.subtotal || 0);
      setQuantity(data.cartLength);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user && user.role === "customer") {
      fetchCart();
    }
  }, [user]);

  useEffect(() => {
    if (location || loadingLocation) return;
    if (!navigator.geolocation) {
      alert(
        "Geolocation is not supported by your browser. Please Allow Location to continue",
      );
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // ✅ Use restaurant backend proxy instead of calling OpenStreetMap directly
          const { data } = await axios.get(
            `${restaurantService}api/geocode/reverse?lat=${latitude}&lon=${longitude}`,
          );

          setLocation({
            latitude,
            longitude,
            formattedAddress: data.display_name || "current location",
          });

          const addr = data.address || {};
          setCity(
            data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.suburb ||
              "Your Location",
          );

          // setLoadingLocation(false);
        } catch (error) {
          console.warn("Geocode proxy error:", error);
          setCity("Location Error");
          setLocation({
            latitude,
            longitude,
            formattedAddress: "Manual Location Needed",
          });
        } finally {
          setLoadingLocation(false);
        }
      },
      (err) => {
        console.error("Geolocation Permission Error:", err.message);
        setCity("Permission Denied");
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        isAuth,
        loading,
        setIsAuth,
        setLoading,
        setUser,
        user,
        location,
        loadingLocation,
        city,
        cart,
        fetchCart,
        quantity,
        subTotal,
      }}
    >
      {children} <Toaster />
    </AppContext.Provider>
  );
};

export const useAppData = (): AppContextType => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppData must be used within AppProvider");
  }
  return context;
};
