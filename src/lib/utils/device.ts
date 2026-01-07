export interface DeviceInfo {
  name: string
  os: string
  browser: string
}

function detectBrowser(userAgent: string): string {

  if (userAgent.includes("OPR") || userAgent.includes("Opera")) return "Opera"
  if (userAgent.includes("Edg")) return "Microsoft Edge"
  if (userAgent.includes("Vivaldi")) return "Vivaldi"
  if (userAgent.includes("Brave")) return "Brave"
  if (userAgent.includes("Seamonkey")) return "Seamonkey"

  if (userAgent.includes("Chrome")) return "Google Chrome"
  if (userAgent.includes("Safari")) return "Safari"
  if (userAgent.includes("Firefox")) return "Mozilla Firefox"

  return "Unknown Browser";
}

function detectOs(userAgent: string): string {

  if(userAgent.includes("iPhone")) return "IPhone"
  if(userAgent.includes("Anroid")) return "Android"
  if(userAgent.includes("Windows")) return "Windows"
  if (userAgent.includes("Macintosh") || userAgent.includes("Mac OS")) return "macOS"
  if(userAgent.includes("Linux")) return "Linux"

  if (userAgent.includes("PlayStation")) return "PlayStation";
  if (userAgent.includes("Xbox")) return "Xbox";

  return "Unknown OS"
}

export default function getDeviceInfo(): DeviceInfo {
  const userAgent = navigator.userAgent

  const browser = detectBrowser(userAgent)
  const os = detectOs(userAgent)

  const name = `${browser} - ${os}`

  return {
    name,
    os,
    browser
  }
}