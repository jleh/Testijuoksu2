import { useSelector } from "react-redux";

export const Menu = () => {
  const events = useSelector((state) => state.events.events);
  const runners = useSelector((state) => state.runners.runners);

  return (
    <nav className="flex ml-2">
      <div className="flex flex-col mr-5">
        <label>Tapahtuma:</label>
        <select>
          <option>Valitse...</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.event_date}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col mr-5">
        <label>Juoksija:</label>
        <select>
          <option>Valitse...</option>
          {runners.map((runner) => (
            <option key={runner.id} value={runner.id}>
              {runner.name}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
};
