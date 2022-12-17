const queue: any[] = [];
const activePreFlushCbs: any[] = [];
let isFlushPending = false;
const p = Promise.resolve();

export function nextTick(fn?: any) {
  return fn ? p.then(fn) : p;
}

export function queueJobs(job: any) {
  if (!queue.includes(job)) {
    queue.push(job);
  }

  queueFlush();
}
function queueFlush() {
  if (isFlushPending) return;
  isFlushPending = true;

  nextTick(flushJobs);
}

function flushJobs() {
  isFlushPending = false;

  flushPreFlushCbs();

  let job: any;
  while ((job = queue.shift())) {
    job && job();
  }
}

export function queuePreFlushCb(job) {
  activePreFlushCbs.push(job);

  queueFlush();
}

function flushPreFlushCbs() {
  for (let i = 0; i < activePreFlushCbs.length; i++) {
    activePreFlushCbs[i]();
  }
}
