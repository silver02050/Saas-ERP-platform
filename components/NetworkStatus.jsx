"use client";
import { faWifi3 } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useNetworkStatus from "check-user-network-status";
import React from "react";
const NetworkStatus = () => {
  const networkStatus = useNetworkStatus();
  if (!networkStatus) {
    return (
      <div>
        <FontAwesomeIcon
          icon={faWifi3}
          height={220}
          width={220}
          size="9x"
          fade
          opacity="0.5"
          color="#0005"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          alt="dashboard"
        />
      </div>
    );
  }
  return null; // Return null if network status is not false
};

export default NetworkStatus;
