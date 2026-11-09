const pushRun = (runs, run) => {
  const previous = runs.at(-1);
  if (previous && previous.bold === run.bold) {
    runs[runs.length - 1] = {
      bold: run.bold,
      text: previous.text + run.text,
    };
    return;
  }
  runs.push(run);
};

export const briefingRuns = (text) => {
  const runs = [];
  let rest = text;
  while (rest.length > 0) {
    const open = rest.indexOf("**");
    if (open === -1) {
      pushRun(runs, { bold: false, text: rest });
      break;
    }
    const close = rest.indexOf("**", open + 2);
    if (close === -1) {
      pushRun(runs, { bold: false, text: rest });
      break;
    }
    if (open > 0) {
      pushRun(runs, { bold: false, text: rest.slice(0, open) });
    }
    const bold = rest.slice(open + 2, close);
    if (bold.length > 0) {
      pushRun(runs, { bold: true, text: bold });
    }
    rest = rest.slice(close + 2);
  }
  return runs;
};
