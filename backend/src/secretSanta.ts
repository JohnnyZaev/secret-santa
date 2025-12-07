// Fisher-Yates shuffle algorithm
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function assignSecretSantas(participants: string[]): { [userId: string]: string } {
  if (participants.length < 2) {
    throw new Error('Need at least 2 participants');
  }

  const givers = [...participants];
  let receivers = shuffle([...participants]);

  // Ensure no one gets themselves
  // If someone gets themselves, try to swap with next person
  for (let i = 0; i < givers.length; i++) {
    if (givers[i] === receivers[i]) {
      // Try to swap with next person (wrap around if at end)
      const nextIndex = (i + 1) % givers.length;
      [receivers[i], receivers[nextIndex]] = [receivers[nextIndex], receivers[i]];
    }
  }

  // Create assignments object
  const assignments: { [userId: string]: string } = {};
  for (let i = 0; i < givers.length; i++) {
    assignments[givers[i]] = receivers[i];
  }

  return assignments;
}

