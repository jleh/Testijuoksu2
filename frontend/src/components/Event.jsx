import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchEventResults } from "../slices/resultsSlice";
import ResultsTable from "./ResultsTable";

export default Event = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();

  const events = useSelector((store) => store.events.events);
  const eventResults = useSelector((store) => store.results.eventResults);

  const event = events.find((event) => event.id === eventId);
  const results = eventResults[eventId];

  useEffect(() => {
    if (!results) dispatch(fetchEventResults(eventId));
  }, [results, dispatch, eventId]);

  if (!event || !results) return null;

  console.log(results);

  return (
    <section>
      <h2 className="font-medium leading-tight text-4xl">{event.event_date}</h2>

      <h3 className="font-medium leading-tight text-3xl">Naiset</h3>
      <ResultsTable results={results} filter="F" />

      <h3 className="font-medium leading-tight text-3xl">Miehet</h3>
      <ResultsTable results={results} filter="M" />
    </section>
  );
};
