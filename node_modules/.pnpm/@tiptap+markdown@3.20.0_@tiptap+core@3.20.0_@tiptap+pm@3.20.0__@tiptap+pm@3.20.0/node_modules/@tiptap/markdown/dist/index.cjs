"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/Extension.ts



var _core = require('@tiptap/core');

// src/MarkdownManager.ts





var _marked = require('marked');

// src/utils.ts
function wrapInMarkdownBlock(prefix, content) {
  const lines = content.split("\n");
  const output = lines.flatMap((line) => [line, ""]).map((line) => `${prefix}${line}`).join("\n");
  return output.slice(0, output.length - 1);
}
function findMarksToClose(currentMarks, nextNode) {
  const marksToClose = [];
  Array.from(currentMarks.keys()).forEach((markType) => {
    if (!nextNode || !nextNode.marks || !nextNode.marks.map((mark) => mark.type).includes(markType)) {
      marksToClose.push(markType);
    }
  });
  return marksToClose;
}
function findMarksToOpen(activeMarks, currentMarks) {
  const marksToOpen = [];
  Array.from(currentMarks.entries()).forEach(([markType, mark]) => {
    if (!activeMarks.has(markType)) {
      marksToOpen.push({ type: markType, mark });
    }
  });
  return marksToOpen;
}
function findMarksToCloseAtEnd(activeMarks, currentMarks, nextNode, markSetsEqual) {
  const isLastNode = !nextNode;
  const nextNodeHasNoMarks = nextNode && nextNode.type === "text" && (!nextNode.marks || nextNode.marks.length === 0);
  const nextNodeHasDifferentMarks = nextNode && nextNode.type === "text" && nextNode.marks && !markSetsEqual(currentMarks, new Map(nextNode.marks.map((mark) => [mark.type, mark])));
  const marksToCloseAtEnd = [];
  if (isLastNode || nextNodeHasNoMarks || nextNodeHasDifferentMarks) {
    if (nextNode && nextNode.type === "text" && nextNode.marks) {
      const nextMarks = new Map(nextNode.marks.map((mark) => [mark.type, mark]));
      Array.from(activeMarks.keys()).forEach((markType) => {
        if (!nextMarks.has(markType)) {
          marksToCloseAtEnd.push(markType);
        }
      });
    } else if (isLastNode || nextNodeHasNoMarks) {
      marksToCloseAtEnd.push(...Array.from(activeMarks.keys()));
    }
  }
  return marksToCloseAtEnd;
}
function closeMarksBeforeNode(activeMarks, getMarkClosing) {
  let beforeMarkdown = "";
  Array.from(activeMarks.keys()).reverse().forEach((markType) => {
    const mark = activeMarks.get(markType);
    const closeMarkdown = getMarkClosing(markType, mark);
    if (closeMarkdown) {
      beforeMarkdown = closeMarkdown + beforeMarkdown;
    }
  });
  activeMarks.clear();
  return beforeMarkdown;
}
function reopenMarksAfterNode(marksToReopen, activeMarks, getMarkOpening) {
  let afterMarkdown = "";
  Array.from(marksToReopen.entries()).forEach(([markType, mark]) => {
    const openMarkdown = getMarkOpening(markType, mark);
    if (openMarkdown) {
      afterMarkdown += openMarkdown;
    }
    activeMarks.set(markType, mark);
  });
  return afterMarkdown;
}
function isTaskItem(item) {
  const raw = item.raw || item.text || "";
  const match = raw.match(/^(\s*)[-+*]\s+\[([ xX])\]\s+/);
  if (match) {
    return { isTask: true, checked: match[2].toLowerCase() === "x", indentLevel: match[1].length };
  }
  return { isTask: false, indentLevel: 0 };
}
function assumeContentType(content, contentType) {
  if (typeof content !== "string") {
    return "json";
  }
  return contentType;
}

// src/MarkdownManager.ts
var MarkdownManager = class {
  /**
   * Create a MarkdownManager.
   * @param options.marked Optional marked instance to use (injected).
   * @param options.markedOptions Optional options to pass to marked.setOptions
   * @param options.indentation Indentation settings (style and size).
   * @param options.extensions An array of Tiptap extensions to register for markdown parsing and rendering.
   */
  constructor(options) {
    this.baseExtensions = [];
    this.extensions = [];
    this.lastParseResult = null;
    var _a, _b, _c, _d, _e;
    this.markedInstance = (_a = options == null ? void 0 : options.marked) != null ? _a : _marked.marked;
    this.lexer = new this.markedInstance.Lexer();
    this.indentStyle = (_c = (_b = options == null ? void 0 : options.indentation) == null ? void 0 : _b.style) != null ? _c : "space";
    this.indentSize = (_e = (_d = options == null ? void 0 : options.indentation) == null ? void 0 : _d.size) != null ? _e : 2;
    this.baseExtensions = (options == null ? void 0 : options.extensions) || [];
    if ((options == null ? void 0 : options.markedOptions) && typeof this.markedInstance.setOptions === "function") {
      this.markedInstance.setOptions(options.markedOptions);
    }
    this.registry = /* @__PURE__ */ new Map();
    this.nodeTypeRegistry = /* @__PURE__ */ new Map();
    if (options == null ? void 0 : options.extensions) {
      this.baseExtensions = options.extensions;
      const flattened = _core.flattenExtensions.call(void 0, options.extensions);
      flattened.forEach((ext) => this.registerExtension(ext, false));
    }
    this.lexer = new this.markedInstance.Lexer();
  }
  /** Returns the underlying marked instance. */
  get instance() {
    return this.markedInstance;
  }
  /** Returns the correct indentCharacter (space or tab) */
  get indentCharacter() {
    return this.indentStyle === "space" ? " " : "	";
  }
  /** Returns the correct indentString repeated X times */
  get indentString() {
    return this.indentCharacter.repeat(this.indentSize);
  }
  /** Helper to quickly check whether a marked instance is available. */
  hasMarked() {
    return !!this.markedInstance;
  }
  /**
   * Register a Tiptap extension (Node/Mark/Extension). This will read
   * `markdownName`, `parseMarkdown`, `renderMarkdown` and `priority` from the
   * extension config (using the same resolution used across the codebase).
   */
  registerExtension(extension, recreateLexer = true) {
    var _a, _b;
    this.extensions.push(extension);
    const name = extension.name;
    const tokenName = _core.getExtensionField.call(void 0, extension, "markdownTokenName") || name;
    const parseMarkdown = _core.getExtensionField.call(void 0, extension, "parseMarkdown");
    const renderMarkdown = _core.getExtensionField.call(void 0, extension, "renderMarkdown");
    const tokenizer = _core.getExtensionField.call(void 0, extension, "markdownTokenizer");
    const markdownCfg = (_a = _core.getExtensionField.call(void 0, extension, "markdownOptions")) != null ? _a : null;
    const isIndenting = (_b = markdownCfg == null ? void 0 : markdownCfg.indentsContent) != null ? _b : false;
    const spec = {
      tokenName,
      nodeName: name,
      parseMarkdown,
      renderMarkdown,
      isIndenting,
      tokenizer
    };
    if (tokenName && parseMarkdown) {
      const parseExisting = this.registry.get(tokenName) || [];
      parseExisting.push(spec);
      this.registry.set(tokenName, parseExisting);
    }
    if (renderMarkdown) {
      const renderExisting = this.nodeTypeRegistry.get(name) || [];
      renderExisting.push(spec);
      this.nodeTypeRegistry.set(name, renderExisting);
    }
    if (tokenizer && this.hasMarked()) {
      this.registerTokenizer(tokenizer);
      if (recreateLexer) {
        this.lexer = new this.markedInstance.Lexer();
      }
    }
  }
  /**
   * Register a custom tokenizer with marked.js for parsing non-standard markdown syntax.
   */
  registerTokenizer(tokenizer) {
    if (!this.hasMarked()) {
      return;
    }
    const { name, start, level = "inline", tokenize } = tokenizer;
    const tokenizeInline = (src) => {
      return this.lexer.inlineTokens(src);
    };
    const tokenizeBlock = (src) => {
      return this.lexer.blockTokens(src);
    };
    const helper = {
      inlineTokens: tokenizeInline,
      blockTokens: tokenizeBlock
    };
    let startCb;
    if (!start) {
      startCb = (src) => {
        const result = tokenize(src, [], helper);
        if (result && result.raw) {
          const index = src.indexOf(result.raw);
          return index;
        }
        return -1;
      };
    } else {
      startCb = typeof start === "function" ? start : (src) => src.indexOf(start);
    }
    const markedExtension = {
      name,
      level,
      start: startCb,
      tokenizer: (src, tokens) => {
        const result = tokenize(src, tokens, helper);
        if (result && result.type) {
          return {
            ...result,
            type: result.type || name,
            raw: result.raw || "",
            tokens: result.tokens || []
          };
        }
        return void 0;
      },
      childTokens: []
    };
    this.markedInstance.use({
      extensions: [markedExtension]
    });
  }
  /** Get registered handlers for a token type and try each until one succeeds. */
  getHandlersForToken(type) {
    try {
      return this.registry.get(type) || [];
    } catch (e) {
      return [];
    }
  }
  /** Get the first handler for a token type (for backwards compatibility). */
  getHandlerForToken(type) {
    const markdownHandlers = this.getHandlersForToken(type);
    if (markdownHandlers.length > 0) {
      return markdownHandlers[0];
    }
    const nodeTypeHandlers = this.getHandlersForNodeType(type);
    return nodeTypeHandlers.length > 0 ? nodeTypeHandlers[0] : void 0;
  }
  /** Get registered handlers for a node type (for rendering). */
  getHandlersForNodeType(type) {
    try {
      return this.nodeTypeRegistry.get(type) || [];
    } catch (e2) {
      return [];
    }
  }
  /**
   * Serialize a ProseMirror-like JSON document (or node array) to a Markdown string
   * using registered renderers and fallback renderers.
   */
  serialize(docOrContent) {
    if (!docOrContent) {
      return "";
    }
    const result = this.renderNodes(docOrContent, docOrContent);
    return this.isEmptyOutput(result) ? "" : result;
  }
  /**
   * Check if the markdown output represents an empty document.
   * Empty documents may contain only &nbsp; entities or non-breaking space characters
   * which are used by the Paragraph extension to preserve blank lines.
   */
  isEmptyOutput(markdown) {
    if (!markdown || markdown.trim() === "") {
      return true;
    }
    const cleanedOutput = markdown.replace(/&nbsp;/g, "").replace(/\u00A0/g, "").trim();
    return cleanedOutput === "";
  }
  /**
   * Parse markdown string into Tiptap JSON document using registered extension handlers.
   */
  parse(markdown) {
    if (!this.hasMarked()) {
      throw new Error("No marked instance available for parsing");
    }
    const tokens = this.markedInstance.lexer(markdown);
    const content = this.parseTokens(tokens);
    return {
      type: "doc",
      content
    };
  }
  /**
   * Convert an array of marked tokens into Tiptap JSON nodes using registered extension handlers.
   */
  parseTokens(tokens) {
    return tokens.map((token) => this.parseToken(token)).filter((parsed) => parsed !== null).flatMap((parsed) => Array.isArray(parsed) ? parsed : [parsed]);
  }
  /**
   * Parse a single token into Tiptap JSON using the appropriate registered handler.
   */
  parseToken(token) {
    if (!token.type) {
      return null;
    }
    if (token.type === "list") {
      return this.parseListToken(token);
    }
    const handlers = this.getHandlersForToken(token.type);
    const helpers = this.createParseHelpers();
    const result = handlers.find((handler) => {
      if (!handler.parseMarkdown) {
        return false;
      }
      const parseResult = handler.parseMarkdown(token, helpers);
      const normalized = this.normalizeParseResult(parseResult);
      if (normalized && (!Array.isArray(normalized) || normalized.length > 0)) {
        this.lastParseResult = normalized;
        return true;
      }
      return false;
    });
    if (result && this.lastParseResult) {
      const toReturn = this.lastParseResult;
      this.lastParseResult = null;
      return toReturn;
    }
    return this.parseFallbackToken(token);
  }
  /**
   * Parse a list token, handling mixed bullet and task list items by splitting them into separate lists.
   * This ensures that consecutive task items and bullet items are grouped and parsed as separate list nodes.
   *
   * @param token The list token to parse
   * @returns Array of parsed list nodes, or null if parsing fails
   */
  parseListToken(token) {
    if (!token.items || token.items.length === 0) {
      return this.parseTokenWithHandlers(token);
    }
    const hasTask = token.items.some((item) => isTaskItem(item).isTask);
    const hasNonTask = token.items.some((item) => !isTaskItem(item).isTask);
    if (!hasTask || !hasNonTask || this.getHandlersForToken("taskList").length === 0) {
      return this.parseTokenWithHandlers(token);
    }
    const groups = [];
    let currentGroup = [];
    let currentType = null;
    for (let i = 0; i < token.items.length; i += 1) {
      const item = token.items[i];
      const { isTask, checked, indentLevel } = isTaskItem(item);
      let processedItem = item;
      if (isTask) {
        const raw = item.raw || item.text || "";
        const lines = raw.split("\n");
        const firstLineMatch = lines[0].match(/^\s*[-+*]\s+\[([ xX])\]\s+(.*)$/);
        const mainContent = firstLineMatch ? firstLineMatch[2] : "";
        let nestedTokens = [];
        if (lines.length > 1) {
          const nestedRaw = lines.slice(1).join("\n");
          if (nestedRaw.trim()) {
            const nestedLines = lines.slice(1);
            const nonEmptyLines = nestedLines.filter((line) => line.trim());
            if (nonEmptyLines.length > 0) {
              const minIndent = Math.min(...nonEmptyLines.map((line) => line.length - line.trimStart().length));
              const trimmedLines = nestedLines.map((line) => {
                if (!line.trim()) {
                  return "";
                }
                return line.slice(minIndent);
              });
              const nestedContent = trimmedLines.join("\n").trim();
              if (nestedContent) {
                nestedTokens = this.markedInstance.lexer(`${nestedContent}
`);
              }
            }
          }
        }
        processedItem = {
          type: "taskItem",
          raw: "",
          mainContent,
          indentLevel,
          checked: checked != null ? checked : false,
          text: mainContent,
          tokens: this.lexer.inlineTokens(mainContent),
          nestedTokens
        };
      }
      const itemType = isTask ? "taskList" : "list";
      if (currentType !== itemType) {
        if (currentGroup.length > 0) {
          groups.push({ type: currentType, items: currentGroup });
        }
        currentGroup = [processedItem];
        currentType = itemType;
      } else {
        currentGroup.push(processedItem);
      }
    }
    if (currentGroup.length > 0) {
      groups.push({ type: currentType, items: currentGroup });
    }
    const results = [];
    for (let i = 0; i < groups.length; i += 1) {
      const group = groups[i];
      const subToken = { ...token, type: group.type, items: group.items };
      const parsed = this.parseToken(subToken);
      if (parsed) {
        if (Array.isArray(parsed)) {
          results.push(...parsed);
        } else {
          results.push(parsed);
        }
      }
    }
    return results.length > 0 ? results : null;
  }
  /**
   * Parse a token using registered handlers (extracted for reuse).
   */
  parseTokenWithHandlers(token) {
    if (!token.type) {
      return null;
    }
    const handlers = this.getHandlersForToken(token.type);
    const helpers = this.createParseHelpers();
    const result = handlers.find((handler) => {
      if (!handler.parseMarkdown) {
        return false;
      }
      const parseResult = handler.parseMarkdown(token, helpers);
      const normalized = this.normalizeParseResult(parseResult);
      if (normalized && (!Array.isArray(normalized) || normalized.length > 0)) {
        this.lastParseResult = normalized;
        return true;
      }
      return false;
    });
    if (result && this.lastParseResult) {
      const toReturn = this.lastParseResult;
      this.lastParseResult = null;
      return toReturn;
    }
    return this.parseFallbackToken(token);
  }
  /**
   * Creates helper functions for parsing markdown tokens.
   * @returns An object containing helper functions for parsing.
   */
  createParseHelpers() {
    return {
      parseInline: (tokens) => this.parseInlineTokens(tokens),
      parseChildren: (tokens) => this.parseTokens(tokens),
      createTextNode: (text, marks) => {
        const node = {
          type: "text",
          text,
          marks: marks || void 0
        };
        return node;
      },
      createNode: (type, attrs, content) => {
        const node = {
          type,
          attrs: attrs || void 0,
          content: content || void 0
        };
        if (!attrs || Object.keys(attrs).length === 0) {
          delete node.attrs;
        }
        return node;
      },
      applyMark: (markType, content, attrs) => ({
        mark: markType,
        content,
        attrs: attrs && Object.keys(attrs).length > 0 ? attrs : void 0
      })
    };
  }
  /**
   * Escape special regex characters in a string.
   */
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  /**
   * Parse inline tokens (bold, italic, links, etc.) into text nodes with marks.
   * This is the complex part that handles mark nesting and boundaries.
   */
  parseInlineTokens(tokens) {
    var _a, _b, _c, _d;
    const result = [];
    for (let i = 0; i < tokens.length; i += 1) {
      const token = tokens[i];
      if (token.type === "text") {
        result.push({
          type: "text",
          text: token.text || ""
        });
      } else if (token.type === "html") {
        const raw = ((_b = (_a = token.raw) != null ? _a : token.text) != null ? _b : "").toString();
        const isClosing = /^<\/[\s]*[\w-]+/i.test(raw);
        const openMatch = raw.match(/^<[\s]*([\w-]+)(\s|>|\/|$)/i);
        if (!isClosing && openMatch && !/\/>$/.test(raw)) {
          const tagName = openMatch[1];
          const escapedTagName = this.escapeRegex(tagName);
          const closingRegex = new RegExp(`^<\\/\\s*${escapedTagName}\\b`, "i");
          let foundIndex = -1;
          const parts = [raw];
          for (let j = i + 1; j < tokens.length; j += 1) {
            const t = tokens[j];
            const tRaw = ((_d = (_c = t.raw) != null ? _c : t.text) != null ? _d : "").toString();
            parts.push(tRaw);
            if (t.type === "html" && closingRegex.test(tRaw)) {
              foundIndex = j;
              break;
            }
          }
          if (foundIndex !== -1) {
            const mergedRaw = parts.join("");
            const mergedToken = {
              type: "html",
              raw: mergedRaw,
              text: mergedRaw,
              block: false
            };
            const parsed = this.parseHTMLToken(mergedToken);
            if (parsed) {
              const normalized = this.normalizeParseResult(parsed);
              if (Array.isArray(normalized)) {
                result.push(...normalized);
              } else if (normalized) {
                result.push(normalized);
              }
            }
            i = foundIndex;
            continue;
          }
        }
        const parsedSingle = this.parseHTMLToken(token);
        if (parsedSingle) {
          const normalized = this.normalizeParseResult(parsedSingle);
          if (Array.isArray(normalized)) {
            result.push(...normalized);
          } else if (normalized) {
            result.push(normalized);
          }
        }
      } else if (token.type) {
        const markHandler = this.getHandlerForToken(token.type);
        if (markHandler && markHandler.parseMarkdown) {
          const helpers = this.createParseHelpers();
          const parsed = markHandler.parseMarkdown(token, helpers);
          if (this.isMarkResult(parsed)) {
            const markedContent = this.applyMarkToContent(parsed.mark, parsed.content, parsed.attrs);
            result.push(...markedContent);
          } else {
            const normalized = this.normalizeParseResult(parsed);
            if (Array.isArray(normalized)) {
              result.push(...normalized);
            } else if (normalized) {
              result.push(normalized);
            }
          }
        } else if (token.tokens) {
          result.push(...this.parseInlineTokens(token.tokens));
        }
      }
    }
    return result;
  }
  /**
   * Apply a mark to content nodes.
   */
  applyMarkToContent(markType, content, attrs) {
    return content.map((node) => {
      if (node.type === "text") {
        const existingMarks = node.marks || [];
        const newMark = attrs ? { type: markType, attrs } : { type: markType };
        return {
          ...node,
          marks: [...existingMarks, newMark]
        };
      }
      return {
        ...node,
        content: node.content ? this.applyMarkToContent(markType, node.content, attrs) : void 0
      };
    });
  }
  /**
  * Check if a parse result represents a mark to be applied.
  */
  isMarkResult(result) {
    return result && typeof result === "object" && "mark" in result;
  }
  /**
   * Normalize parse results to ensure they're valid JSONContent.
   */
  normalizeParseResult(result) {
    if (!result) {
      return null;
    }
    if (this.isMarkResult(result)) {
      return result.content;
    }
    return result;
  }
  /**
   * Fallback parsing for common tokens when no specific handler is registered.
   */
  parseFallbackToken(token) {
    switch (token.type) {
      case "paragraph":
        return {
          type: "paragraph",
          content: token.tokens ? this.parseInlineTokens(token.tokens) : []
        };
      case "heading":
        return {
          type: "heading",
          attrs: { level: token.depth || 1 },
          content: token.tokens ? this.parseInlineTokens(token.tokens) : []
        };
      case "text":
        return {
          type: "text",
          text: token.text || ""
        };
      case "html":
        return this.parseHTMLToken(token);
      case "space":
        return null;
      default:
        if (token.tokens) {
          return this.parseTokens(token.tokens);
        }
        return null;
    }
  }
  /**
   * Parse HTML tokens using extensions' parseHTML methods.
   * This allows HTML within markdown to be parsed according to extension rules.
   */
  parseHTMLToken(token) {
    const html = token.text || token.raw || "";
    if (!html.trim()) {
      return null;
    }
    if (typeof window === "undefined") {
      if (token.block) {
        return {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: html
            }
          ]
        };
      }
      return {
        type: "text",
        text: html
      };
    }
    try {
      const parsed = _core.generateJSON.call(void 0, html, this.baseExtensions);
      if (parsed.type === "doc" && parsed.content) {
        if (token.block) {
          return parsed.content;
        }
        if (parsed.content.length === 1 && parsed.content[0].type === "paragraph" && parsed.content[0].content) {
          return parsed.content[0].content;
        }
        return parsed.content;
      }
      return parsed;
    } catch (error) {
      throw new Error(`Failed to parse HTML in markdown: ${error}`);
    }
  }
  renderNodeToMarkdown(node, parentNode, index = 0, level = 0) {
    var _a;
    if (node.type === "text") {
      return node.text || "";
    }
    if (!node.type) {
      return "";
    }
    const handler = this.getHandlerForToken(node.type);
    if (!handler) {
      return "";
    }
    const helpers = {
      renderChildren: (nodes, separator) => {
        const childLevel = handler.isIndenting ? level + 1 : level;
        if (!Array.isArray(nodes) && nodes.content) {
          return this.renderNodes(nodes.content, node, separator || "", index, childLevel);
        }
        return this.renderNodes(nodes, node, separator || "", index, childLevel);
      },
      indent: (content) => {
        return this.indentString + content;
      },
      wrapInBlock: wrapInMarkdownBlock
    };
    const context = {
      index,
      level,
      parentType: parentNode == null ? void 0 : parentNode.type,
      meta: {
        parentAttrs: parentNode == null ? void 0 : parentNode.attrs
      }
    };
    const rendered = ((_a = handler.renderMarkdown) == null ? void 0 : _a.call(handler, node, helpers, context)) || "";
    return rendered;
  }
  /**
   * Render a node or an array of nodes. Parent type controls how children
   * are joined (which determines newline insertion between children).
   */
  renderNodes(nodeOrNodes, parentNode, separator = "", index = 0, level = 0) {
    if (!Array.isArray(nodeOrNodes)) {
      if (!nodeOrNodes.type) {
        return "";
      }
      return this.renderNodeToMarkdown(nodeOrNodes, parentNode, index, level);
    }
    return this.renderNodesWithMarkBoundaries(nodeOrNodes, parentNode, separator, level);
  }
  /**
   * Render an array of nodes while properly tracking mark boundaries.
   * This handles cases where marks span across multiple text nodes.
   */
  renderNodesWithMarkBoundaries(nodes, parentNode, separator = "", level = 0) {
    const result = [];
    const activeMarks = /* @__PURE__ */ new Map();
    nodes.forEach((node, i) => {
      const nextNode = i < nodes.length - 1 ? nodes[i + 1] : null;
      if (!node.type) {
        return;
      }
      if (node.type === "text") {
        let textContent = node.text || "";
        const currentMarks = new Map((node.marks || []).map((mark) => [mark.type, mark]));
        const marksToOpen = findMarksToOpen(activeMarks, currentMarks);
        const marksToClose = findMarksToClose(currentMarks, nextNode);
        let middleTrailingWhitespace = "";
        if (marksToClose.length > 0) {
          const middleTrailingMatch = textContent.match(/(\s+)$/);
          if (middleTrailingMatch) {
            middleTrailingWhitespace = middleTrailingMatch[1];
            textContent = textContent.slice(0, -middleTrailingWhitespace.length);
          }
        }
        marksToClose.forEach((markType) => {
          const mark = currentMarks.get(markType);
          const closeMarkdown = this.getMarkClosing(markType, mark);
          if (closeMarkdown) {
            textContent += closeMarkdown;
          }
          if (activeMarks.has(markType)) {
            activeMarks.delete(markType);
          }
        });
        let leadingWhitespace = "";
        if (marksToOpen.length > 0) {
          const leadingMatch = textContent.match(/^(\s+)/);
          if (leadingMatch) {
            leadingWhitespace = leadingMatch[1];
            textContent = textContent.slice(leadingWhitespace.length);
          }
        }
        marksToOpen.forEach(({ type, mark }) => {
          const openMarkdown = this.getMarkOpening(type, mark);
          if (openMarkdown) {
            textContent = openMarkdown + textContent;
          }
          if (!marksToClose.includes(type)) {
            activeMarks.set(type, mark);
          }
        });
        textContent = leadingWhitespace + textContent;
        const marksToCloseAtEnd = findMarksToCloseAtEnd(
          activeMarks,
          currentMarks,
          nextNode,
          this.markSetsEqual.bind(this)
        );
        let trailingWhitespace = "";
        if (marksToCloseAtEnd.length > 0) {
          const trailingMatch = textContent.match(/(\s+)$/);
          if (trailingMatch) {
            trailingWhitespace = trailingMatch[1];
            textContent = textContent.slice(0, -trailingWhitespace.length);
          }
        }
        marksToCloseAtEnd.forEach((markType) => {
          const mark = activeMarks.get(markType);
          const closeMarkdown = this.getMarkClosing(markType, mark);
          if (closeMarkdown) {
            textContent += closeMarkdown;
          }
          activeMarks.delete(markType);
        });
        textContent += trailingWhitespace;
        textContent += middleTrailingWhitespace;
        result.push(textContent);
      } else {
        const marksToReopen = new Map(activeMarks);
        const beforeMarkdown = closeMarksBeforeNode(activeMarks, this.getMarkClosing.bind(this));
        const nodeContent = this.renderNodeToMarkdown(node, parentNode, i, level);
        const afterMarkdown = node.type === "hardBreak" ? "" : reopenMarksAfterNode(marksToReopen, activeMarks, this.getMarkOpening.bind(this));
        result.push(beforeMarkdown + nodeContent + afterMarkdown);
      }
    });
    return result.join(separator);
  }
  /**
   * Get the opening markdown syntax for a mark type.
   */
  getMarkOpening(markType, mark) {
    const handlers = this.getHandlersForNodeType(markType);
    const handler = handlers.length > 0 ? handlers[0] : void 0;
    if (!handler || !handler.renderMarkdown) {
      return "";
    }
    const placeholder = "\uE000__TIPTAP_MARKDOWN_PLACEHOLDER__\uE001";
    const syntheticNode = {
      type: markType,
      attrs: mark.attrs || {},
      content: [{ type: "text", text: placeholder }]
    };
    try {
      const rendered = handler.renderMarkdown(
        syntheticNode,
        {
          renderChildren: () => placeholder,
          indent: (content) => content,
          wrapInBlock: (prefix, content) => prefix + content
        },
        { index: 0, level: 0, parentType: "text", meta: {} }
      );
      const placeholderIndex = rendered.indexOf(placeholder);
      return placeholderIndex >= 0 ? rendered.substring(0, placeholderIndex) : "";
    } catch (err) {
      throw new Error(`Failed to get mark opening for ${markType}: ${err}`);
    }
  }
  /**
   * Get the closing markdown syntax for a mark type.
   */
  getMarkClosing(markType, mark) {
    const handlers = this.getHandlersForNodeType(markType);
    const handler = handlers.length > 0 ? handlers[0] : void 0;
    if (!handler || !handler.renderMarkdown) {
      return "";
    }
    const placeholder = "\uE000__TIPTAP_MARKDOWN_PLACEHOLDER__\uE001";
    const syntheticNode = {
      type: markType,
      attrs: mark.attrs || {},
      content: [{ type: "text", text: placeholder }]
    };
    try {
      const rendered = handler.renderMarkdown(
        syntheticNode,
        {
          renderChildren: () => placeholder,
          indent: (content) => content,
          wrapInBlock: (prefix, content) => prefix + content
        },
        { index: 0, level: 0, parentType: "text", meta: {} }
      );
      const placeholderIndex = rendered.indexOf(placeholder);
      const placeholderEnd = placeholderIndex + placeholder.length;
      return placeholderIndex >= 0 ? rendered.substring(placeholderEnd) : "";
    } catch (err) {
      throw new Error(`Failed to get mark closing for ${markType}: ${err}`);
    }
  }
  /**
   * Check if two mark sets are equal.
   */
  markSetsEqual(marks1, marks2) {
    if (marks1.size !== marks2.size) {
      return false;
    }
    return Array.from(marks1.keys()).every((type) => marks2.has(type));
  }
};
var MarkdownManager_default = MarkdownManager;

// src/Extension.ts
var Markdown = _core.Extension.create({
  name: "markdown",
  addOptions() {
    return {
      indentation: { style: "space", size: 2 },
      marked: void 0,
      markedOptions: {}
    };
  },
  addCommands() {
    return {
      setContent: (content, options) => {
        if (!(options == null ? void 0 : options.contentType)) {
          return _core.commands.setContent(content, options);
        }
        const actualContentType = assumeContentType(content, options == null ? void 0 : options.contentType);
        if (actualContentType !== "markdown" || !this.editor.markdown) {
          return _core.commands.setContent(content, options);
        }
        const mdContent = this.editor.markdown.parse(content);
        return _core.commands.setContent(mdContent, options);
      },
      insertContent: (value, options) => {
        if (!(options == null ? void 0 : options.contentType)) {
          return _core.commands.insertContent(value, options);
        }
        const actualContentType = assumeContentType(value, options == null ? void 0 : options.contentType);
        if (actualContentType !== "markdown" || !this.editor.markdown) {
          return _core.commands.insertContent(value, options);
        }
        const mdContent = this.editor.markdown.parse(value);
        return _core.commands.insertContent(mdContent, options);
      },
      insertContentAt: (position, value, options) => {
        if (!(options == null ? void 0 : options.contentType)) {
          return _core.commands.insertContentAt(position, value, options);
        }
        const actualContentType = assumeContentType(value, options == null ? void 0 : options.contentType);
        if (actualContentType !== "markdown" || !this.editor.markdown) {
          return _core.commands.insertContentAt(position, value, options);
        }
        const mdContent = this.editor.markdown.parse(value);
        return _core.commands.insertContentAt(position, mdContent, options);
      }
    };
  },
  addStorage() {
    return {
      manager: new MarkdownManager_default({
        indentation: this.options.indentation,
        marked: this.options.marked,
        markedOptions: this.options.markedOptions,
        extensions: []
      })
    };
  },
  onBeforeCreate() {
    if (this.editor.markdown) {
      console.error(
        "[tiptap][markdown]: There is already a `markdown` property on the editor instance. This might lead to unexpected behavior."
      );
      return;
    }
    this.storage.manager = new MarkdownManager_default({
      indentation: this.options.indentation,
      marked: this.options.marked,
      markedOptions: this.options.markedOptions,
      extensions: this.editor.extensionManager.baseExtensions
    });
    this.editor.markdown = this.storage.manager;
    this.editor.getMarkdown = () => {
      return this.storage.manager.serialize(this.editor.getJSON());
    };
    if (!this.editor.options.contentType) {
      return;
    }
    const assumedType = assumeContentType(this.editor.options.content, this.editor.options.contentType);
    if (assumedType !== "markdown") {
      return;
    }
    if (!this.editor.markdown) {
      throw new Error(
        '[tiptap][markdown]: The `contentType` option is set to "markdown", but the Markdown extension is not added to the editor. Please add the Markdown extension to use this feature.'
      );
    }
    if (this.editor.options.content === void 0 || typeof this.editor.options.content !== "string") {
      throw new Error(
        '[tiptap][markdown]: The `contentType` option is set to "markdown", but the initial content is not a string. Please provide the initial content as a markdown string.'
      );
    }
    const json = this.editor.markdown.parse(this.editor.options.content);
    this.editor.options.content = json;
  }
});











exports.Markdown = Markdown; exports.MarkdownManager = MarkdownManager; exports.assumeContentType = assumeContentType; exports.closeMarksBeforeNode = closeMarksBeforeNode; exports.findMarksToClose = findMarksToClose; exports.findMarksToCloseAtEnd = findMarksToCloseAtEnd; exports.findMarksToOpen = findMarksToOpen; exports.isTaskItem = isTaskItem; exports.reopenMarksAfterNode = reopenMarksAfterNode; exports.wrapInMarkdownBlock = wrapInMarkdownBlock;
//# sourceMappingURL=index.cjs.map