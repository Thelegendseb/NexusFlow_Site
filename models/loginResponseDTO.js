export class LoginResponseDTO {
    constructor(responseCode, responseDescription, accessToken) {
        this.ResponseCode = responseCode;
        this.ResponseDescription = responseDescription;
        this.AccessToken = accessToken;
    }
}
