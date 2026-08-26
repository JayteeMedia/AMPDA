import { appConfig } from "../../core/config/app.js";
import { HttpError } from "./HttpError.js";

export class ApiClient {

  async get<T>(
    url: string,
  ): Promise<T> {

    const response =
      await fetch(
        `${appConfig.apiBaseUrl}${url}`,
      );

    const contentType =
      response.headers.get(
        "content-type",
      ) ?? "";

    if (!response.ok) {

      const body =
        await response.text();

      throw new HttpError(

        response.status,

        body ||

        response.statusText,

      );

    }

    if (

      !contentType.includes(

        "application/json",

      )

    ) {

      const body =
        await response.text();

      throw new Error(

        [
          "Expected JSON response.",

          "",

          `GET ${url}`,

          "",

          `Content-Type: ${contentType}`,

          "",

          body.substring(
            0,
            250,
          ),

        ].join("\n"),

      );

    }

    return await response.json() as T;

  }

  async post<T>(

    url: string,

    body: unknown,

  ): Promise<T> {

    const response =
      await fetch(

        `${appConfig.apiBaseUrl}${url}`,

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

          },

          body:
            JSON.stringify(body),

        },

      );

    const contentType =
      response.headers.get(
        "content-type",
      ) ?? "";

    if (!response.ok) {

      const text =
        await response.text();

      throw new HttpError(

        response.status,

        text ||

        response.statusText,

      );

    }

    if (

      !contentType.includes(

        "application/json",

      )

    ) {

      const bodyText =
        await response.text();

      throw new Error(

        [
          "Expected JSON response.",

          "",

          `POST ${url}`,

          "",

          `Content-Type: ${contentType}`,

          "",

          bodyText.substring(
            0,
            250,
          ),

        ].join("\n"),

      );

    }

    return await response.json() as T;

  }

}

export const api =
  new ApiClient();
