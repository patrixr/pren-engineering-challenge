import { RestService } from "./base";

export class Prenetics extends RestService {
  constructor(baseUrl = "http://localhost:8080/test/v1.0/") {
    super(baseUrl);
  }
}