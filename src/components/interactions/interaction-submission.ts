export interface SubmissionLock {
  current: boolean;
}

export async function runSingleSubmission(lock: SubmissionLock, submission: () => Promise<void>) {
  if (lock.current) return false;
  lock.current = true;

  try {
    await submission();
    return true;
  } finally {
    lock.current = false;
  }
}
