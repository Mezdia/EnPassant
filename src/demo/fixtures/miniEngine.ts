import { Chess, type Color, type Move, type Role, type Square } from "chessops";
import { makeUci } from "chessops/util";
import { positionFromFen } from "@/utils/chessops";

const PIECE_VALUES: Record<string, number> = {
    pawn: 100,
    knight: 320,
    bishop: 330,
    rook: 500,
    queen: 900,
    king: 0,
};

const PROMOTION_ROLES: Role[] = ["queen", "rook", "bishop", "knight"];

/**
 * A tiny static-evaluation "engine" that powers the demo's Lichess cloud-eval
 * fixture. It runs entirely in the browser and never touches a real backend:
 * for any requested FEN it computes a material + mobility evaluation with a
 * shallow capture search, then returns multi-PV lines in the same shape as
 * lichess.org/api/cloud-eval.
 */
export function cloudEval(fen: string, multiPv: number) {
    const [pos] = positionFromFen(fen);
    if (!pos) {
        return null;
    }

    const lines = bestLines(pos, multiPv);
    return {
        fen,
        knodes: 180,
        depth: 16,
        pvs: lines.map(({ moves, score }) => ({
            moves: moves.join(" "),
            ...(score === 0 ? { cp: 0 } : { cp: Math.max(-900, Math.min(900, score)) }),
        })),
    };
}

function bestLines(root: Chess, multiPv: number): { moves: string[]; score: number }[] {
    const turn = root.turn;
    const scored = legalMoves(root)
        .map((move) => {
            const next = root.clone();
            next.play(move);
            const score = -search(next, 2, -Infinity, Infinity);
            return { move: makeUci(move), score };
        })
        .sort((a, b) => b.score - a.score);

    const lines = scored.slice(0, Math.max(1, multiPv)).map(({ move }) => {
        const continuation = playContinuation(root, move, 3);
        return {
            moves: continuation.moves,
            score: scoreFromPerspective(continuation.score, turn),
        };
    });

    if (lines.length === 0) {
        return [{ moves: [], score: 0 }];
    }
    return lines;
}

/** Greedy continuation so the demo lines look like real engine variations. */
function playContinuation(root: Chess, firstUci: string, plies: number) {
    const chess = root.clone();
    const uci = [firstUci];
    chess.play(parseMove(chess, firstUci));
    let lastScore = 0;

    for (let i = 1; i < plies; i++) {
        const options = legalMoves(chess).map((move) => {
            const next = chess.clone();
            next.play(move);
            return { move, score: -search(next, 1, -Infinity, Infinity) };
        });
        options.sort((a, b) => b.score - a.score);
        if (options.length === 0) break;
        const best = options[0];
        lastScore = best.score;
        uci.push(makeUci(best.move));
        chess.play(best.move);
    }

    return { moves: uci, score: lastScore };
}

function parseMove(chess: Chess, uci: string): Move {
    const move = legalMoves(chess).find((m) => makeUci(m) === uci);
    if (!move) throw new Error(`Invalid demo move: ${uci}`);
    return move;
}

function scoreFromPerspective(score: number, color: Color): number {
    return color === "white" ? score : -score;
}

function search(chess: Chess, depth: number, alpha: number, beta: number): number {
    if (depth === 0) {
        return quiescence(chess, alpha, beta);
    }

    const moves = legalMoves(chess);
    if (moves.length === 0) {
        return chess.isCheck() ? -100000 + (4 - depth) * 100 : 0;
    }

    let best = -Infinity;
    for (const move of moves) {
        const next = chess.clone();
        next.play(move);
        const score = -search(next, depth - 1, -beta, -alpha);
        if (score > best) best = score;
        if (best > alpha) alpha = best;
        if (alpha >= beta) break;
    }
    return best;
}

/** Captures only — keeps the demo "engine" fast while avoiding horizon effects. */
function quiescence(chess: Chess, alpha: number, beta: number): number {
    const standPat = evaluate(chess);
    if (standPat >= beta) return beta;
    if (standPat > alpha) alpha = standPat;

    const captures = legalMoves(chess).filter((move) => chess.board.get(move.to) !== undefined);
    for (const move of captures) {
        const next = chess.clone();
        next.play(move);
        const score = -quiescence(next, -beta, -alpha);
        if (score >= beta) return beta;
        if (score > alpha) alpha = score;
    }
    return alpha;
}

/** Static evaluation in centipawns from the side-to-move's perspective. */
function evaluate(chess: Chess): number {
    let material = 0;
    for (let i = 0; i < 64; i++) {
        const piece = chess.board.get(i as Square);
        if (!piece) continue;
        const value = PIECE_VALUES[piece.role] ?? 0;
        const sign = piece.color === "white" ? 1 : -1;
        material += sign * value;

        if (piece.role === "pawn") {
            const rank = piece.color === "white" ? Math.floor(i / 8) : 7 - Math.floor(i / 8);
            material += sign * rank * 2;
        }
    }

    const mobility = legalMoves(chess).length * 4;
    const perspective = chess.turn === "white" ? 1 : -1;
    return (material + perspective * mobility) * perspective;
}

/** All legal moves, including the four promotion options on the last rank. */
export function legalMoves(chess: Chess): Move[] {
    const moves: Move[] = [];
    for (const [from, toSet] of chess.allDests()) {
        const piece = chess.board.get(from);
        if (!piece) continue;
        for (const to of toSet) {
            const promoting =
                piece.role === "pawn" && (piece.color === "white" ? to >= 56 : to <= 7);
            if (promoting) {
                for (const promotion of PROMOTION_ROLES) {
                    moves.push({ from, to, promotion });
                }
            } else {
                moves.push({ from, to });
            }
        }
    }
    return moves;
}
