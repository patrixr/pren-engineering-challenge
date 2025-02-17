import { readEnv } from '../utils/env';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export interface Logger {
  info(msg: any): void;
  warn(msg: any): void;
  error(msg: any): void;
  debug(msg: any): void;
  setLevel(level: LogLevel): void;
  getLevel(): LogLevel;
}

class CommonLogger implements Logger {
  private level: LogLevel = LogLevel.INFO;

  constructor() {
    const lvl = readEnv('LOG_LEVEL', 'info');
    const level = LogLevel[lvl.toUpperCase() as keyof typeof LogLevel];
    if (level !== undefined) {
      this.setLevel(level);
    }
  }

  private formatMessage(level: string, msg: any): string {
    const timestamp = new Date().toISOString();
    const formattedMsg = typeof msg === 'object' ? JSON.stringify(msg) : msg;
    return `[${timestamp}] ${level}: ${formattedMsg}`;
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  getLevel(): LogLevel {
    return this.level;
  }

  info(msg: any): void {
    if (this.level >= LogLevel.INFO) {
      console.log(this.formatMessage('INFO', msg));
    }
  }

  warn(msg: any): void {
    if (this.level >= LogLevel.WARN) {
      console.warn(this.formatMessage('WARN', msg));
    }
  }

  error(msg: any): void {
    if (this.level >= LogLevel.ERROR) {
      console.error(this.formatMessage('ERROR', msg));
    }
  }

  debug(msg: any): void {
    if (this.level >= LogLevel.DEBUG) {
      console.log(this.formatMessage('DEBUG', msg));
    }
  }
}

export const logger: Logger = new CommonLogger();
