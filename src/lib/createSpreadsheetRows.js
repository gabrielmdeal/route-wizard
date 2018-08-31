import DummySegment from './DummySegment';

function isBlank(str) {
  return str === undefined || str === null || str === '' || isNaN(str);
}

function roundTo(number, position) {
  return Number(number.toFixed(position));
}

function roundToFeet(meters) {
  if (isBlank(meters)) {
    return null;
  }

  return roundTo(meters * 3.28084, 0);
}

function roundToMiles(meters) {
  if (isBlank(meters)) {
    return null;
  }

  return roundTo(meters * 0.000621371, 1);
}

function createRows(realSegments) {
  if (realSegments.length == 0) {
    return [];
  }

  let cumulativeDistance = 0;
  const segments = [
    new DummySegment({}),
    ...realSegments,
    new DummySegment({ title: 'End' }),
  ];

  return segments.slice(1).map((segment, index) => {
    const prevSegment = segments[index];
    cumulativeDistance += prevSegment.distance() || 0;

    return {
      cumulativeDistance: roundToMiles(cumulativeDistance),
      description: segment.description(),
      distance: roundToMiles(prevSegment.distance()),
      gain: roundToFeet(prevSegment.gain()),
      location: index == 0 ? 'Start' : segment.title,
      locomotion: segment.locomotion(),
      loss: roundToFeet(prevSegment.loss()),
      surface: segment.surface(),
      users: segment.users(),
    };
  });
}

function filterColumns(filteredRows, unfilteredColumns) {
  const optionalColumns = ['users', 'surface', 'locomotion'];
  const unusedOptionalColumns = optionalColumns.filter(
    (optionalColumn) => !filteredRows.find((row) => row[optionalColumn])
  );

  return unfilteredColumns.filter(
    (column) => !unusedOptionalColumns.includes(column.key)
  );
}

export default function(segments, unfilteredColumns) {
  const rows = createRows(segments);
  const columns = filterColumns(rows, unfilteredColumns);

  return { rows, columns };
}
