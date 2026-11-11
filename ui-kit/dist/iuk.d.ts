import type * as React from 'react';

/** 메시지 조각: 일반 문자열, 강조 {hl}, 줄바꿈 '\n' */
export type MessagePart = string | { hl: string };

export interface BriefMessageProps { messages: MessagePart[][]; hold?: number; step?: number; onSelect?: (index: number) => void; className?: string }
export declare function BriefMessage(props: BriefMessageProps): React.ReactElement | null;

export interface HlProps extends React.HTMLAttributes<HTMLElement> { as?: 'span' | 'a' | 'button'; children?: React.ReactNode }
export declare function Hl(props: HlProps): React.ReactElement;

export interface UserBubbleProps { children?: React.ReactNode; className?: string }
export declare function UserBubble(props: UserBubbleProps): React.ReactElement;

export interface AIMessageProps { children?: React.ReactNode; typing?: boolean; card?: React.ReactNode; className?: string }
export declare function AIMessage(props: AIMessageProps): React.ReactElement;

export interface TypingIndicatorProps { label?: string }
export declare function TypingIndicator(props: TypingIndicatorProps): React.ReactElement;

export interface SuggestionChipsProps { items: string[]; onSelect?: (text: string) => void; label?: string; className?: string }
export declare function SuggestionChips(props: SuggestionChipsProps): React.ReactElement | null;

export interface ComposerProps { placeholder?: string; onSubmit?: (text: string) => void; onBrowse?: () => void; onAccounts?: () => void; mode?: 'idle' | 'chat' | 'typing'; fixed?: boolean; id?: string; className?: string }
export declare function Composer(props: ComposerProps): React.ReactElement;

export interface ResultCardProps { rows?: [string, string][]; action?: { label: string; onClick?: () => void }; doneLabel?: string; className?: string; children?: React.ReactNode }
export declare function ResultCard(props: ResultCardProps): React.ReactElement;

export interface AccountMove { label: string; amount: number }
export interface AccountCardProps { logo?: { text: string; tone?: 'yellow'; color?: string; ink?: string }; name: React.ReactNode; kind?: string; amount: string; unit?: string; moves?: AccountMove[]; sub?: React.ReactNode; action?: { label: string; onClick?: () => void }; id?: string; className?: string }
export declare function AccountCard(props: AccountCardProps): React.ReactElement;

declare global { interface Window { IUK: { BriefMessage: typeof BriefMessage; Hl: typeof Hl; UserBubble: typeof UserBubble; AIMessage: typeof AIMessage; TypingIndicator: typeof TypingIndicator; SuggestionChips: typeof SuggestionChips; Composer: typeof Composer; ResultCard: typeof ResultCard; AccountCard: typeof AccountCard } } }
