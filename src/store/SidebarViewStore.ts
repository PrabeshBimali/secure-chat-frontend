import type { StoreListenerType } from "../types/global.interfaces"

export type SidebarViewType = "HOME" | "ARCHIVED" | "BLOCKED" | "SETTINGS"

class SidebarViewStore {
  view: SidebarViewType
  listeners: Set<StoreListenerType>

  constructor() {
    this.view = "HOME"
    this.listeners = new Set()
  }

  subscribe = (callback: StoreListenerType) => {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  getSnapshot = () => {
    return this.view
  }

  notifyAllListeners = () => {
    this.listeners.forEach((callback) => callback())
  }

  setState = (state: SidebarViewType) => {
    this.view = state
    this.notifyAllListeners()
  }
}

export const sidebarViewStore = new SidebarViewStore()