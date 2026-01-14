import type { HTTPResponse } from "../types/global.interfaces";

const API_URL = `${import.meta.env.VITE_API_URL}`

interface RequestChallengeResponse {
  userid: number
  nonce: string
}

export async function requestChallenge(username: string, device_pbk: string): Promise<HTTPResponse<RequestChallengeResponse>> {

  const requestChallengePayload = {
    username, 
    device_pbk
  }

  const rawResponse = await fetch(`${API_URL}/auth/request-challenge`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(requestChallengePayload),
  });

  const response: HTTPResponse<RequestChallengeResponse> = await rawResponse.json()

  return response
}