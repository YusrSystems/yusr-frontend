import type { PosSessionDto } from "@/core/data/posSession";
import type { PosTerminalDto } from "@/core/data/posTerminal";


export class PosTempCache
{
	private static terminalId?: number;
	private static activeSession?: PosSessionDto | null = null;
	private static activeTerminal?: PosTerminalDto | null = null;

	/**
	 * Save the active session for a specific terminal.
	 */
	public static setSession(terminalId: number, session: PosSessionDto | null): void
	{
		if (this.terminalId !== terminalId)
		{
			this.clear();
		}
		this.terminalId = terminalId;
		this.activeSession = session;
	}

	/**
	 * Save the active terminal details.
	 */
	public static setTerminal(terminal: PosTerminalDto | null): void
	{
		if (terminal)
		{
			this.terminalId = terminal.id;
			this.activeTerminal = terminal;
		}
		else
		{
			this.activeTerminal = null;
		}
	}

	/**
	 * Get cached session for a given terminal ID.
	 * Returns `undefined` if no cache exists for this terminal.
	 */
	public static getSession(terminalId: number): PosSessionDto | null | undefined
	{
		if (this.terminalId === terminalId)
		{
			return this.activeSession;
		}
		return undefined;
	}

	/**
	 * Get cached terminal for a given terminal ID.
	 * Returns `undefined` if no cache exists for this terminal.
	 */
	public static getTerminal(terminalId: number): PosTerminalDto | null | undefined
	{
		if (this.terminalId === terminalId)
		{
			return this.activeTerminal;
		}
		return undefined;
	}

	/**
	 * Clear the cache (e.g., when closing a session or logging out).
	 */
	public static clear(): void
	{
		this.terminalId = undefined;
		this.activeSession = null;
		this.activeTerminal = null;
	}
}