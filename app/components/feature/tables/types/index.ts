export interface IconProps {
  name: string;
  size?: number;
  style?: React.CSSProperties;
  className?: string;
}

export interface CardHeadProps {
  title: string;
  sub?: string;
  right?: React.ReactNode;
}

export interface LblProps {
  children: React.ReactNode;
}

export interface InpProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}

export interface SelProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[] | string[];
}

export interface BtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export interface IndexCardProps {
  title: string;
  sub?: string;
  color?: string;
  initRows?: Record<string, string | number>[];
  accent?: string;
}

export interface IndexRowProps {
  row: Record<string, string | number>;
  onRemove: () => void;
}

export interface DocItem {
  name: string;
  date?: string;
  size?: string;
  type?: string;
  body?: string;
}

export interface NoteItem {
  author: string;
  date: string;
  text: string;
}

export interface TemplateDoc {
  name: string;
  date: string;
  size: string;
  type: string;
  body?: string;
}

export interface CreateTemplateModalProps {
  onClose: () => void;
  onSave: (tpl: TemplateDoc) => void;
}

export interface FinalPrelimModalProps {
  onClose: () => void;
  onSave: (doc: { name: string; date: string; size: string; type: string }) => void;
}

export interface SendPrelimModalProps {
  onClose: () => void;
  docs: DocItem[];
}

export interface ManualSearchModalProps {
  onClose: () => void;
}

export interface FInpProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  half?: boolean;
  style?: React.CSSProperties;
}

export interface FSelProps {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: ({ value: string; label: string } | string)[];
  style?: React.CSSProperties;
}

export interface FRowProps {
  children: React.ReactNode;
}

export interface FGridProps {
  cols?: number;
  children: React.ReactNode;
}

export interface ResultBoxProps {
  children: React.ReactNode;
}

export interface SearchDataTraceProps {
  source: string;
}

export interface CreateOrderModalProps {
  onClose: () => void;
}

export interface OrderRow {
  no: string;
  apn: string;
  addr: string;
  owner: string;
  county: string;
  status: string;
}

export interface RecentFile {
  no: string;
  addr: string;
  owner: string;
  status: string;
}

export interface StepItem {
  id: number;
  label: string;
  short: string;
  icon: string;
}

export interface NavIconItem {
  name: string;
  label: string;
  active: boolean;
}

export interface IndexSection {
  title: string;
  sub: string;
  accent: string;
  rows: Record<string, string | number>[];
}

export interface TcRow {
  rec: string;
  type: string;
  instr: string;
  book: string;
  pg: string;
  status: string;
}

export interface TemplateExample {
  id: string;
  name: string;
  desc: string;
  icon: string;
  color: string;
  badge: string;
  body: string;
}
