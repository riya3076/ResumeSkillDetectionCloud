const AWS = require("aws-sdk");

function AwsConfig() {
    AWS.config.update({
        accessKeyId: "ASIA6A2O43PEOMEI6VWN",
        secretAccessKey: "W1PFlomAFA0QXZaoOdv+jMVFIsx8z4IB6N7LDG1Z",
        sessionToken: "FwoGZXIvYXdzEBAaDG6wBcSORePQOhPIDyLAAdM2N1krTkSb9qXP3006t3J7DRx1k3tAoXcp+hDQ72Y4cVZr2VBtHVu6i1V2a61WThvPfINwdpmfiPONlKuPRtPL4M+IYSx+6ycdIO/mrEe04xzvLT3Xgt4k5JMWhHzY4zbrHDvZeFZFKh0/zk0axX53O3+SCRAOFEaH91W3n/zrp9rxvwfFQZOoZDfJ4bnSY6ChZDWpef4an+T05SHvYOzew9CkIgKKHYGhCRmEPgb21P9qWlFCI9fceTbhpoQ9TSiIrLmrBjItYxD3DlD1VKlW6Rhgwnjfyx5N+kUqNo40P5/V02s2YJZgKSifMlHTuyNWJxmf",
        region: "us-east-1",
      });
}

module.exports = AwsConfig;