module.exports = [
    //Consumer: Gov - Health Canada
    {
        name: "Aron",
        email: "consumer@gov.ca",
        role: "Consumer",
        token: ""
    },
    //Consumer: Insurance
    {
        name: "Mary",
        email: "consumer@insurance.com",
        role: "Consumer",
        token: ""
    },
    //Provider: Weather
    {
        name: "Bob",
        email: "provider@weather.com",
        role: "Provider",
        token: "",
        datasets: [
            {
                name: "North American Weather Patterns",
                description: "North American Weather trends, temperatures, and humidity measurements for cities in the United States and Canada. Includes potential warnings for storms, natural disasters and other anomalous weather patterns for the region. Cities include Boston, New York, Toronto, Vancouver and Montreal",
                price: 2.0,
                format: "zip",
                url: "https://water.usgs.gov/GIS/dsdl/pp1766_FMP.zip",
                notes: "North American Weather trends, temperatures, and humidity measurements for cities in the United States and Canada. Includes potential warnings for storms, natural disasters and other anomalous weather patterns for the region. Cities include Boston, New York, Toronto, Vancouver and Montreal"
            },
            {
                name: "American Weather Patterns",
                description: "American Weather trends, temperatures, and humidity measurements for cities in the United States. Includes potential warnings for storms, natural disasters and other anomalous weather patterns for the region. Cities include Boston, New York, and San Francisco",
                price: 1.19,
                format: "zip",
                url: "https://water.usgs.gov/GIS/dsdl/pp1766_FMP.zip",
                notes: "American Weather trends, temperatures, and humidity measurements for cities in the United States. Includes potential warnings for storms, natural disasters and other anomalous weather patterns for the region. Cities include Boston, New York, and San Francisco"
            },
            {
                name: "Canadian Weather Patterns",
                description: "Canadian Weather trends, temperatures, and humidity measurements for cities in Canada. Includes potential warnings for storms, natural disasters and other anomalous weather patterns for the region. Cities include Toronto, Vancouver, Calgary and Montreal",
                price: 0.99,
                format: "zip",
                url: "https://water.usgs.gov/GIS/dsdl/pp1766_FMP.zip",
                notes: "Canadian Weather trends, temperatures, and humidity measurements for cities in Canada. Includes potential warnings for storms, natural disasters and other anomalous weather patterns for the region. Cities include Toronto, Vancouver, Calgary and Montreal"
            }
        ]
    },
    //Provider: Health
    {
        name: "Jim",
        email: "provider@health.com",
        role: "Provider",
        token: "",
        datasets: [
            {
                name: "Canadian Pharmaceutical Usage",
                description: "Pharmaceutical drugs sold in Canada. Includes brand name and generic drugs sold at every pharmacy in Canada with breakdowns between types of drugs and pharmaceutical companies. Cities like Toronto, Vancouver, Montreal",
                price: 8.29,
                format: "zip",
                url: "https://water.usgs.gov/GIS/dsdl/pp1766_FMP.zip",
                notes: "Pharmaceutical drugs sold in Canada. Includes brand name and generic drugs sold at every pharmacy in Canada with breakdowns between types of drugs and pharmaceutical companies. Cities like Toronto, Vancouver, Montreal"
            },
            {
                name: "Canadian Emergency Room Wait Times",
                description: "Emergency room wait times for hospitals in Canadian cities Toronto, Vancouver, Montreal. Wait times are listed per hospital and per region. Wait times also include number in patients in each triage level.",
                price: 4.75,
                format: "zip",
                url: "https://water.usgs.gov/GIS/dsdl/pp1766_FMP.zip",
                notes: "Emergency room wait times for hospitals in Canadian cities Toronto, Vancouver, Montreal. Wait times are listed per hospital and per region. Wait times also include number in patients in each triage level."
            }
        ]
    },
    //Provider: Toronto
    {
        name: "Arlene",
        email: "provider@toronto.ca",
        role: "Provider",
        token: "",
        datasets: [
            {
                name: "Toronto Crime Rates",
                description: "Rates of crimes in Toronto including gun and knife crime, robberies, and murders. Relative comparisons to other Canadian cities.",
                price: 5.95,
                format: "zip",
                url: "https://water.usgs.gov/GIS/dsdl/pp1766_FMP.zip",
                notes: "Rates of crimes in Toronto including gun and knife crime, robberies, and murders. Relative comparisons to other Canadian cities."
            },
            {
                name: "Traffic Accidents in Toronto",
                description: "Rates, locations, and severity of accidents in Toronto and the Greater Toronto Area (GTA).",
                price: 3.60,
                format: "zip",
                url: "https://water.usgs.gov/GIS/dsdl/pp1766_FMP.zip",
                notes: "Rates, locations, and severity of accidents in Toronto and the Greater Toronto Area (GTA)."
            }
        ]
    },
    //Provider: Air Quality Measurements
    {
        name: "Jessica",
        email: "provider@airquality.com",
        role: "Provider",
        token: "",
        datasets: [
            {
                name: "Air Quality Measurements in Toronto",
                description: "Smog, humidity, and pollution measurements for Toronto, Canada. Measurements are taken per hour. Larger number of sensors are located in areas of high population density. Measurements are subject to an error rate no greater than 5%.",
                price: 0.50,
                format: "zip",
                url: "https://water.usgs.gov/GIS/dsdl/pp1766_FMP.zip",
                notes: "Smog, humidity, and pollution measurements for Toronto, Canada. Measurements are taken per hour. Larger number of sensors are located in areas of high population density. Measurements are subject to an error rate no greater than 5%."
            },
            {
                name: "Air Quality Measurements in New York",
                description: "Smog, humidity, and pollution measurements for New York, USA. Measurements are taken per hour. Larger number of sensors are located in areas of high population density. Measurements are subject to an error rate no greater than 5%.",
                price: 0.50,
                format: "zip",
                url: "https://water.usgs.gov/GIS/dsdl/pp1766_FMP.zip",
                notes: "Smog, humidity, and pollution measurements for New York, USA. Measurements are taken per hour. Larger number of sensors are located in areas of high population density. Measurements are subject to an error rate no greater than 5%."
            },
            {
                name: "Air Quality Measurements in Montreal",
                description: "Smog, humidity, and pollution measurements for Montreal, Canada. Measurements are taken per hour. Larger number of sensors are located in areas of high population density. Measurements are subject to an error rate no greater than 5%.",
                price: 0.50,
                format: "zip",
                url: "https://water.usgs.gov/GIS/dsdl/pp1766_FMP.zip",
                notes: "Smog, humidity, and pollution measurements for Montreal, Canada. Measurements are taken per hour. Larger number of sensors are located in areas of high population density. Measurements are subject to an error rate no greater than 5%."
            }
        ]
    },
    //Admin
    {
        name: "Jane",
        email: "admin@tr.com",
        role: "Administrator",
        token: ""
    }
];