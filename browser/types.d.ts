/// <reference types="chrome" />

// WXT global functions
declare function defineBackground(fn: () => void): any;
declare function defineContentScript(config: {
  matches: string[];
  runAt?: 'document_start' | 'document_end' | 'document_idle';
  allFrames?: boolean;
  main: () => void;
}): any;
