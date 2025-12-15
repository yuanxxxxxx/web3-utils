import {useEffect} from "react";
import {LANGUAGE_ENUM, THEME_ENUM} from "../types";
import {LANGUAGE_LOCAL_KEY, THEME_LOCAL_KEY} from "../types/constant";
import {useDispatch} from "react-redux";
import { setLanguage, setTheme } from "@/lib/store/appSlice";

export default function useLocalData(){
  const dispatch = useDispatch()
  useEffect(() => {
    if (typeof window !== "undefined"){
      const storedLang = window.localStorage.getItem(LANGUAGE_LOCAL_KEY);
      let defLanguage: LANGUAGE_ENUM = LANGUAGE_ENUM.zh;
      
      if (storedLang === LANGUAGE_ENUM.zh) {
        defLanguage = LANGUAGE_ENUM.zh;
      } else if (storedLang === LANGUAGE_ENUM.zh) {
        defLanguage = LANGUAGE_ENUM.zh;
      } else if (storedLang === LANGUAGE_ENUM.en) {
        defLanguage = LANGUAGE_ENUM.en;
      }

      const defTheme: THEME_ENUM =
        window.localStorage.getItem(THEME_LOCAL_KEY) === THEME_ENUM.dark
          ? THEME_ENUM.dark
          : THEME_ENUM.light;
      dispatch(setTheme(defTheme))
      dispatch(setLanguage(defLanguage))
    }
  },[])
}
