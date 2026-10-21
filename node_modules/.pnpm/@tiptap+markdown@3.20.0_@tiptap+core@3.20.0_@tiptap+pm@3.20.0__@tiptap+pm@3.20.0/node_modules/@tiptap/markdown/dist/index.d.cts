import { AnyExtension, JSONContent, Extension, MarkdownToken, Content } from '@tiptap/core';
import { marked } from 'marked';
import { Fragment, Node } from '@tiptap/pm/model';

declare class MarkdownManager {
    private markedInstance;
    private lexer;
    private registry;
    private nodeTypeRegistry;
    private indentStyle;
    private indentSize;
    private baseExtensions;
    private extensions;
    /**
     * Create a MarkdownManager.
     * @param options.marked Optional marked instance to use (injected).
     * @param options.markedOptions Optional options to pass to marked.setOptions
     * @param options.indentation Indentation settings (style and size).
     * @param options.extensions An array of Tiptap extensions to register for markdown parsing and rendering.
     */
    constructor(options?: {
        marked?: typeof marked;
        markedOptions?: Parameters<typeof marked.setOptions>[0];
        indentation?: {
            style?: 'space' | 'tab';
            size?: number;
        };
        extensions: AnyExtension[];
    });
    /** Returns the underlying marked instance. */
    get instance(): typeof marked;
    /** Returns the correct indentCharacter (space or tab) */
    get indentCharacter(): string;
    /** Returns the correct indentString repeated X times */
    get indentString(): string;
    /** Helper to quickly check whether a marked instance is available. */
    hasMarked(): boolean;
    /**
     * Register a Tiptap extension (Node/Mark/Extension). This will read
     * `markdownName`, `parseMarkdown`, `renderMarkdown` and `priority` from the
     * extension config (using the same resolution used across the codebase).
     */
    registerExtension(extension: AnyExtension, recreateLexer?: boolean): void;
    /**
     * Register a custom tokenizer with marked.js for parsing non-standard markdown syntax.
     */
    private registerTokenizer;
    /** Get registered handlers for a token type and try each until one succeeds. */
    private getHandlersForToken;
    /** Get the first handler for a token type (for backwards compatibility). */
    private getHandlerForToken;
    /** Get registered handlers for a node type (for rendering). */
    private getHandlersForNodeType;
    /**
     * Serialize a ProseMirror-like JSON document (or node array) to a Markdown string
     * using registered renderers and fallback renderers.
     */
    serialize(docOrContent: JSONContent): string;
    /**
     * Check if the markdown output represents an empty document.
     * Empty documents may contain only &nbsp; entities or non-breaking space characters
     * which are used by the Paragraph extension to preserve blank lines.
     */
    private isEmptyOutput;
    /**
     * Parse markdown string into Tiptap JSON document using registered extension handlers.
     */
    parse(markdown: string): JSONContent;
    /**
     * Convert an array of marked tokens into Tiptap JSON nodes using registered extension handlers.
     */
    private parseTokens;
    /**
     * Parse a single token into Tiptap JSON using the appropriate registered handler.
     */
    private parseToken;
    private lastParseResult;
    /**
     * Parse a list token, handling mixed bullet and task list items by splitting them into separate lists.
     * This ensures that consecutive task items and bullet items are grouped and parsed as separate list nodes.
     *
     * @param token The list token to parse
     * @returns Array of parsed list nodes, or null if parsing fails
     */
    private parseListToken;
    /**
     * Parse a token using registered handlers (extracted for reuse).
     */
    private parseTokenWithHandlers;
    /**
     * Creates helper functions for parsing markdown tokens.
     * @returns An object containing helper functions for parsing.
     */
    private createParseHelpers;
    /**
     * Escape special regex characters in a string.
     */
    private escapeRegex;
    /**
     * Parse inline tokens (bold, italic, links, etc.) into text nodes with marks.
     * This is the complex part that handles mark nesting and boundaries.
     */
    private parseInlineTokens;
    /**
     * Apply a mark to content nodes.
     */
    private applyMarkToContent; /**
     * Check if a parse result represents a mark to be applied.
     */
    private isMarkResult;
    /**
     * Normalize parse results to ensure they're valid JSONContent.
     */
    private normalizeParseResult;
    /**
     * Fallback parsing for common tokens when no specific handler is registered.
     */
    private parseFallbackToken;
    /**
     * Parse HTML tokens using extensions' parseHTML methods.
     * This allows HTML within markdown to be parsed according to extension rules.
     */
    private parseHTMLToken;
    renderNodeToMarkdown(node: JSONContent, parentNode?: JSONContent, index?: number, level?: number): string;
    /**
     * Render a node or an array of nodes. Parent type controls how children
     * are joined (which determines newline insertion between children).
     */
    renderNodes(nodeOrNodes: JSONContent | JSONContent[], parentNode?: JSONContent, separator?: string, index?: number, level?: number): string;
    /**
     * Render an array of nodes while properly tracking mark boundaries.
     * This handles cases where marks span across multiple text nodes.
     */
    private renderNodesWithMarkBoundaries;
    /**
     * Get the opening markdown syntax for a mark type.
     */
    private getMarkOpening;
    /**
     * Get the closing markdown syntax for a mark type.
     */
    private getMarkClosing;
    /**
     * Check if two mark sets are equal.
     */
    private markSetsEqual;
}

type ContentType = 'json' | 'html' | 'markdown';

declare module '@tiptap/core' {
    interface Editor {
        /**
         * Get the content of the editor as markdown.
         */
        getMarkdown: () => string;
        /**
         * The markdown manager instance.
         */
        markdown?: MarkdownManager;
    }
    interface EditorOptions {
        /**
         * The content type the content is provided as.
         *
         * @default 'json'
         */
        contentType?: ContentType;
    }
    interface Storage {
        markdown: MarkdownExtensionStorage;
    }
    interface InsertContentOptions {
        /**
         * The content type the content is provided as.
         *
         * @default 'json'
         */
        contentType?: ContentType;
    }
    interface InsertContentAtOptions {
        /**
         * The content type the content is provided as.
         *
         * @default 'json'
         */
        contentType?: ContentType;
    }
    interface SetContentOptions {
        /**
         * The content type the content is provided as.
         *
         * @default 'json'
         */
        contentType?: ContentType;
    }
}
type MarkdownExtensionOptions = {
    /**
     * Configure the indentation style and size for lists and code blocks.
     * - `style`: Choose between spaces or tabs. Default is 'space'.
     * - `size`: Number of spaces or tabs for indentation. Default is 2.
     */
    indentation?: {
        style?: 'space' | 'tab';
        size?: number;
    };
    /**
     * Use a custom version of `marked` for markdown parsing and serialization.
     * If not provided, the default `marked` instance will be used.
     */
    marked?: typeof marked;
    /**
     * Options to pass to `marked.setOptions()`.
     * See the [marked documentation](https://marked.js.org/using_advanced#options) for available options.
     */
    markedOptions?: Parameters<typeof marked.setOptions>[0];
};
type MarkdownExtensionStorage = {
    manager: MarkdownManager;
};
declare const Markdown: Extension<MarkdownExtensionOptions, MarkdownExtensionStorage>;

/**
 * Wraps each line of the content with the given prefix.
 * @param prefix The prefix to wrap each line with.
 * @param content The content to wrap.
 * @returns The content with each line wrapped with the prefix.
 */
declare function wrapInMarkdownBlock(prefix: string, content: string): string;
/**
 * Identifies marks that need to be closed, based on the marks in the next node.
 */
declare function findMarksToClose(currentMarks: Map<string, any>, nextNode: any): string[];
/**
 * Identifies marks that need to be opened (in current node but not active).
 */
declare function findMarksToOpen(activeMarks: Map<string, any>, currentMarks: Map<string, any>): Array<{
    type: string;
    mark: any;
}>;
/**
 * Determines which marks need to be closed at the end of the current text node.
 * This handles cases where marks end at node boundaries or when transitioning
 * to nodes with different mark sets.
 */
declare function findMarksToCloseAtEnd(activeMarks: Map<string, any>, currentMarks: Map<string, any>, nextNode: any, markSetsEqual: (a: Map<string, any>, b: Map<string, any>) => boolean): string[];
/**
 * Closes active marks before rendering a non-text node.
 * Returns the closing markdown syntax and clears the active marks.
 */
declare function closeMarksBeforeNode(activeMarks: Map<string, any>, getMarkClosing: (markType: string, mark: any) => string): string;
/**
 * Reopens marks after rendering a non-text node.
 * Returns the opening markdown syntax and updates the active marks.
 */
declare function reopenMarksAfterNode(marksToReopen: Map<string, any>, activeMarks: Map<string, any>, getMarkOpening: (markType: string, mark: any) => string): string;
/**
 * Check if a markdown list item token is a task item and extract its state.
 *
 * @param item The list item token to check
 * @returns Object containing isTask flag, checked state, and indentation level
 *
 * @example
 * ```ts
 * isTaskItem({ raw: '- [ ] Task' }) // { isTask: true, checked: false, indentLevel: 0 }
 * isTaskItem({ raw: '  - [x] Done' }) // { isTask: true, checked: true, indentLevel: 2 }
 * isTaskItem({ raw: '- Regular' }) // { isTask: false, indentLevel: 0 }
 * ```
 */
declare function isTaskItem(item: MarkdownToken): {
    isTask: boolean;
    checked?: boolean;
    indentLevel: number;
};
/**
 * Assumes the content type based off the content.
 * @param content The content to assume the type for.
 * @param contentType The content type that should be prioritized.
 */
declare function assumeContentType(content: (Content | Fragment | Node) | string, contentType: ContentType): ContentType;

export { Markdown, type MarkdownExtensionOptions, type MarkdownExtensionStorage, MarkdownManager, assumeContentType, closeMarksBeforeNode, findMarksToClose, findMarksToCloseAtEnd, findMarksToOpen, isTaskItem, reopenMarksAfterNode, wrapInMarkdownBlock };
