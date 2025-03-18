
import React from "react";
import EventsBanner from "./events/EventsBanner";
import EventsContent from "./events/EventsContent";

const Events = () => {
  return (
    <div className="bg-texture">
      <EventsBanner />
      <EventsContent />
    </div>
  );
};

export default Events;
