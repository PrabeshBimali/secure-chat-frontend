import type { HTTPResponse } from "../types/global.interfaces";

const API_URL = `${import.meta.env.VITE_API_URL}`

interface RequestChallengeResponse {
  userid: number
  nonce: string
}

//temporary
interface VerifyChallengeResponse {
  userid: string
}

interface RegisterResponse {
  id: number;
  email: string;
  username: string;
}

interface DeviceRegistration {
  name: string
  browser: string
  os: string
  device_pbk: string
}

export interface RegistrationPayload {
  username: string
  email: string
  encryption_pbk: string
  identity_pbk: string
  device: DeviceRegistration
}

export async function register(payload: RegistrationPayload): Promise<HTTPResponse<RegisterResponse>> {
  const rawResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const response: HTTPResponse<RegisterResponse> = await rawResponse.json()

  return response
}

export async function requestChallenge(username: string, device_pbk: string): Promise<HTTPResponse<RequestChallengeResponse>> {

  const requestChallengePayload = {
    username, 
    device_pbk
  }

  const rawResponse = await fetch(`${API_URL}/auth/request-challenge`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(requestChallengePayload),
  });

  const response: HTTPResponse<RequestChallengeResponse> = await rawResponse.json()

  return response
}

export async function verifyChallenge(userid: number, device_pbk: string, deviceSignature: string, identitySignature: string): Promise<HTTPResponse<VerifyChallengeResponse>> {
  const verifyChallengePayload = {
    userid,
    device_pbk,
    deviceSignature,
    identitySignature
  }

  const rawResponse = await fetch(`${API_URL}/auth/verify-challenge`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(verifyChallengePayload)
  })

  const response: HTTPResponse<VerifyChallengeResponse> = await rawResponse.json()

  return response
} 