import { exec } from "child_process";

export default function handler(req, res) {
  exec("npx playwright test tests/speaker.spec.js --headed", (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: stderr
      });
    }

    res.status(200).json({
      success: true,
      output: stdout
    });
  });
}