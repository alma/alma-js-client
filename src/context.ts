import { ClientConfig } from './client'
import { ApiMode } from './consts'
import Credentials from './credentials/base'

export class Context {
  public readonly credentials: Credentials
  private readonly config: ClientConfig
  private userAgentComponents: string[] = []

  constructor(credentials: Credentials, options: ClientConfig) {
    this.credentials = credentials
    this.config = options
  }

  get apiRoot(): string {
    return this.config.apiRoot[this.mode].trim()
  }

  get mode(): ApiMode {
    return this.config.mode
  }

  get logger(): Console {
    return this.config.logger
  }

  urlFor(path: string): string {
    const root = this.apiRoot.endsWith('/') ? this.apiRoot.slice(0, -1) : this.apiRoot
    path = path.startsWith('/') ? path.slice(1) : path

    return `${root}/${path}`
  }

  addUserAgentComponent(component: string, version?: string): void {
    if (version) {
      this.userAgentComponents.push(`${component}/${version}`)
    } else {
      this.userAgentComponents.push(component)
    }
  }

  get userAgentString(): string {
    return this.userAgentComponents.reverse().join('; ')
  }
}

export default Context
