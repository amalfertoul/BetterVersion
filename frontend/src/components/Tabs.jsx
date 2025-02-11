import React from "react";

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["All", "Daily", "Weekly", "Monthly", "Yearly"];

  return (
    <div className="tabs">
      {tabs.map(tab => (
        <span
          key={tab}
          className={activeTab === tab.toLowerCase() ? "active" : ""}
          onClick={() => setActiveTab(tab.toLowerCase())}
        >
          {tab}
        </span>
      ))}
    </div>
  );
};

export default Tabs;
