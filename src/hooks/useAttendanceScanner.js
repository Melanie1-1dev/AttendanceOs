import { useCallback, useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useReader } from "@/lib/reader-context";
import { makeUid, nextCardUid, sleep } from "@/lib/attendance-utils";

const pick = (list) => list[Math.floor(Math.random() * list.length)];

export default function useAttendanceScanner({ session, students = [], records = [], onRecorded }) {
  const { isOnline, goOffline } = useReader();
  const [state, setState] = useState("idle");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);

  const reset = useCallback(() => {
    setState("idle");
    setResult(null);
  }, []);

  const scan = useCallback(
    async (uid, { readDelay = 850 } = {}) => {
      if (lock.current) return;
      lock.current = true;
      setBusy(true);
      setResult(null);

      if (!isOnline) {
        setState("offline");
        setResult({ uid });
        lock.current = false;
        setBusy(false);
        return;
      }

      if (!session || session.status !== "open") {
        setState("closed");
        setResult({ uid });
        lock.current = false;
        setBusy(false);
        return;
      }

      setState("scanning");
      await sleep(readDelay);

      const student = students.find((item) => item.rfid_uid && item.rfid_uid === uid) || null;

      if (!student) {
        setState("unknown");
        setResult({ uid });
        lock.current = false;
        setBusy(false);
        return;
      }

      const existing = records.find((item) => item.session_id === session.id && item.student_id === student.id);

      if (existing) {
        setState("duplicate");
        setResult({ uid, student, time: existing.recorded_at });
        lock.current = false;
        setBusy(false);
        return;
      }

      const created = await base44.entities.Attendance.create({
        session_id: session.id,
        student_id: student.id,
        rfid_uid: uid,
        status: "present",
        recorded_at: new Date().toISOString(),
        method: "rfid",
      });

      onRecorded?.(created);
      setState("success");
      setResult({ uid, student, time: created.recorded_at, record: created });
      lock.current = false;
      setBusy(false);
    },
    [isOnline, session, students, records, onRecorded]
  );

  const cardedStudents = students.filter((student) => student.rfid_uid);
  const unrecorded = cardedStudents.filter(
    (student) => !records.some((item) => item.session_id === session?.id && item.student_id === student.id)
  );
  const alreadyRecorded = cardedStudents.filter((student) =>
    records.some((item) => item.session_id === session?.id && item.student_id === student.id)
  );

  const simulateRandom = useCallback(async () => {
    const roll = Math.random();

    if (roll < 0.06) {
      goOffline();
      setResult({ uid: null });
      setState("offline");
      return;
    }
    if (roll < 0.16 && alreadyRecorded.length) {
      await scan(pick(alreadyRecorded).rfid_uid);
      return;
    }
    if (roll < 0.22) {
      await scan(nextCardUid(students));
      return;
    }
    if (unrecorded.length) {
      await scan(pick(unrecorded).rfid_uid);
      return;
    }
    if (alreadyRecorded.length) {
      await scan(pick(alreadyRecorded).rfid_uid);
      return;
    }
    await scan(makeUid());
  }, [alreadyRecorded, unrecorded, students, scan, goOffline]);

  const simulateSuccess = useCallback(async () => {
    const target = unrecorded.length ? pick(unrecorded) : pick(cardedStudents);
    if (!target) {
      setState("unknown");
      setResult({ uid: makeUid() });
      return;
    }
    await scan(target.rfid_uid);
  }, [unrecorded, cardedStudents, scan]);

  const simulateDuplicate = useCallback(async () => {
    if (!alreadyRecorded.length) {
      await simulateSuccess();
      return;
    }
    await scan(pick(alreadyRecorded).rfid_uid);
  }, [alreadyRecorded, scan, simulateSuccess]);

  const simulateUnknown = useCallback(async () => {
    await scan(nextCardUid(students));
  }, [students, scan]);

  const simulateOffline = useCallback(() => {
    goOffline();
    setResult({ uid: null });
    setState("offline");
  }, [goOffline]);

  return {
    state,
    result,
    busy,
    reset,
    scan,
    simulateRandom,
    simulateSuccess,
    simulateDuplicate,
    simulateUnknown,
    simulateOffline,
  };
}