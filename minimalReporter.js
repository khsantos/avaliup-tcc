import chalk from "chalk";

class MinimalReporter {
  onRunComplete(_, results) {
    results.testResults.forEach((suite) => {
      const file = suite.testFilePath.split("/").slice(-2).join("/");
      const hasFailed = suite.numFailingTests > 0;
      const headerColor = hasFailed ? chalk.red.bold : chalk.green.bold;
      console.log(headerColor(`\n ${hasFailed ? "FAIL" : "PASS"}  ${file}`));

      let currentSuite = "";
      suite.testResults.forEach((test) => {
        if (test.ancestorTitles[0] !== currentSuite) {
          currentSuite = test.ancestorTitles[0];
          console.log(`  ${chalk.bold(currentSuite)}`);
        }

        const symbol =
          test.status === "passed" ? chalk.green("√") : chalk.red("×");
        const title = test.title;
        const duration = test.duration ? ` (${test.duration} ms)` : "";
        console.log(`    ${symbol} ${title}${duration}`);

        if (test.status === "failed" && test.failureMessages.length > 0) {
          const cleanMessage = test.failureMessages
            .join("\n")
            // Remove stack traces
            .replace(/(\s+at\s[^\n]+)/g, "")
            // Remove excesso de linhas em branco
            .replace(/\n{3,}/g, "\n\n")
            // Remove tags HTML
            .replace(/<[^>]+>/g, "")
            .trim();

          // Captura linhas que contenham Expected e Received
          const expectedMatch = cleanMessage.match(/Expected:.*$/m);
          const receivedMatch = cleanMessage.match(/Received:.*$/m);

          if (expectedMatch || receivedMatch) {
            console.log();
            if (expectedMatch)
              console.log(chalk.yellow(`      ${expectedMatch[0]}`));
            if (receivedMatch)
              console.log(chalk.cyan(`      ${receivedMatch[0]}`));
            console.log();
          } else {
            // Caso não haja Expected/Received, mostra apenas as primeiras 3 linhas
            const lines = cleanMessage.split("\n").slice(0, 3);
            lines.forEach((line) =>
              console.log(chalk.redBright(`      ${line}`))
            );
            if (cleanMessage.split("\n").length > 3) {
              console.log(chalk.gray("      ..."));
            }
          }
        }
      });
    });
  }
}

export default MinimalReporter;
