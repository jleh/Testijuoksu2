import { sortBy } from "lodash";

import ResultsRow from "./ResultsRow";

const ResultsTable = ({ results, filter }) => {
  const filteredResults = sortBy(
    results.filter(({ sex }) => sex === filter),
    "totalTimeSec"
  );
  const maxSplits = Math.max(
    ...filteredResults.map((result) => result.splits.length)
  );

  return (
    <table className="mb-4 mt-5">
      <thead>
        <tr>
          <th>Nimi</th>
          <th>Aika</th>
          {Array(maxSplits)
            .fill()
            .map((x, i) => (
              <th className="pr-6" key={i}>
                Kierros {i + 1}
              </th>
            ))}
        </tr>
      </thead>
      <tbody>
        {filteredResults.map((row) => (
          <ResultsRow key={row.name} row={row} />
        ))}
      </tbody>
    </table>
  );
};

export default ResultsTable;
