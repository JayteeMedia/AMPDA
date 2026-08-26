export class Logger {

  static info(
    title: string,
    message?: string,
  ) {

    console.log("");

    console.log("==================================================");
    console.log(title);
    console.log("==================================================");

    if (message) {

      console.log(message);

    }

    console.log("");

  }

  static json(
    title: string,
    value: unknown,
  ) {

    console.log("");

    console.log("==================================================");
    console.log(title);
    console.log("==================================================");

    console.log(
      JSON.stringify(
        value,
        null,
        2,
      ),
    );

    console.log("");

  }

  static success(
    message: string,
  ) {

    console.log(`✔ ${message}`);

  }

  static error(
    message: string,
  ) {

    console.error(`✖ ${message}`);

  }

}
