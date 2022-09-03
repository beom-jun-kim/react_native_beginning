import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";

const SEREEN_WIDTH = Dimensions.get("window").width;

const API_KEY = "3cdb98a57730faca4e368816041c8e44";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere:"cloudy-gusts",
  Snow:"snow",
  Rain:"rains",
  Drizzle:"rain",
  Thunderstorm:"linghtning",
};

export default function App() {
  const [city, setCity] = useState("Loading..");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json.daily);
  };
  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        horizontal
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="#eee" size="large" />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View>
                <Text style={styles.date}>
                  {new Date(day.dt * 1000).toString().substring(0, 10)}
                </Text>
                <Text style={styles.temp}>
                  {parseFloat(day.temp.day).toFixed(1)}
                </Text>
                <Fontisto name={icons[day.weather[0].main]} size={50} color="white"/>
              </View>
              <Text style={styles.description}>{day.weather[0].main}</  Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#81c147",
  },
  city: {
    flex: 1.2,
    // backgroundColor: "#81c147",
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 68,
    fontWeight: "600",
    color: "#eee",
  },
  weather: {},
  day: {
    width: SEREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    fontSize: 150,
    color: "#eee",
  },
  description: {
    fontSize: 40,
    color: "#eee",
  },
  date: {
    marginTop: 20,
    fontSize: 40,
    color: "#eee",
  },
});
