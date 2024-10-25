import React from "react";
import "./PrivacyAndData.css";

function PrivacyAndData({ setCurrentPage }) {
  return (
    <div className="privacy-container">
        <button 
        className="back-home-button" 
        onClick={() => setCurrentPage("Home")}
      >
        Back to Home
      </button>
      <h2>Privacy and Data Protection</h2>
      <p>
        By using this application, you agree to the collection and processing of your data in accordance with our privacy policy.
        Our application uses APIs to provide you with accurate and up-to-date weather information, including accessing your location for personalized forecasts.
      </p>

      <h3>What Data We Collect:</h3>
      <ul>
        <li><strong>Location Information</strong>: Your current location is collected to provide weather forecasts specific to your region, using your device's Geolocation API.</li>
        <li><strong>Weather Preferences</strong>: Information like your preferred temperature units (Celsius/Fahrenheit) may be saved locally on your device.</li>
        <li><strong>Usage Data</strong>: Anonymized data on how the app is used, such as interaction logs, may be collected to improve performance.</li>
      </ul>

      <h3>How We Use Your Data:</h3>
      <ul>
        <li><strong>Personalized Weather Forecasts</strong>: Your location data is strictly used to provide relevant weather forecasts for your current or selected location.</li>
        <li><strong>Performance and Analytics</strong>: Anonymized usage data may be collected to improve app functionality, performance, and user experience.</li>
      </ul>

      <h3>Data Security:</h3>
      <p>
        We are committed to ensuring that your information is secure. We have implemented suitable physical, electronic, and managerial procedures to safeguard and secure the data collected.
      </p>

      <h3>Third-Party Services:</h3>
      <p>
        We use third-party APIs such as OpenWeatherMap for retrieving weather data and location services for determining your current position. These services may collect data according to their respective privacy policies, which we encourage you to review.
      </p>

      <h3>Your Rights:</h3>
      <ul>
        <li>You have the right to access, update, or delete any personal information we hold about you.</li>
        <li>You can disable location services at any time through your device settings. However, this may affect some functionality of the app.</li>
      </ul>

      <h3>Consent:</h3>
      <p>
        By using this application, you consent to the collection and use of your data as outlined in this policy.
        For more information or to review our full privacy policy, please visit <a href="#link-to-full-privacy-policy">[link to full privacy policy]</a>.
      </p>
    </div>
  );
}

export default PrivacyAndData;
