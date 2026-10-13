// GDM 95 — tipi dei componenti (documentazione). Ogni componente avvolge React Aria Components 1.21
// e accetta anche le prop del componente React Aria corrispondente.
import type * as React from 'react';

export type IconName =
  | 'about' | 'projects' | 'cv' | 'contacts' | 'skills' | 'timeline' | 'makingof'
  | 'controlpanel' | 'terminal' | 'minefield' | 'trash' | 'privacy' | 'simpleview' | 'run'
  | 'gdm' | 'warning' | 'error' | 'info';

export type GlyphName = 'check' | 'dash' | 'down' | 'up' | 'left' | 'right' | 'minimize' | 'maximize' | 'restore' | 'close';

/** Pulsante a rilievo. `variant="default"` = azione predefinita (Invio). */
export interface ButtonProps {
  variant?: 'normal' | 'default';
  icon?: IconName;
  children?: React.ReactNode;
  onPress?: () => void;
  isDisabled?: boolean;
  autoFocus?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

/** Campo di testo con etichetta, descrizione ed errore collegati. */
export interface TextFieldProps {
  label: string;
  description?: string;
  errorMessage?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  type?: 'text' | 'email' | 'tel' | 'url' | 'search' | 'password';
}

/** Area di testo; `rows` predefinito 5. */
export interface TextAreaProps extends Omit<TextFieldProps, 'type' | 'placeholder'> {
  rows?: number;
}

export interface CheckboxProps {
  children?: React.ReactNode;
  isSelected?: boolean;
  defaultSelected?: boolean;
  isIndeterminate?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  onChange?: (isSelected: boolean) => void;
}

export interface RadioGroupProps {
  label: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  orientation?: 'vertical' | 'horizontal';
  isDisabled?: boolean;
  children?: React.ReactNode;
}

export interface RadioProps {
  value: string;
  isDisabled?: boolean;
  children?: React.ReactNode;
}

export interface SelectOption { id: string; label: string; isDisabled?: boolean }

export interface SelectProps {
  label: string;
  options: SelectOption[];
  selectedKey?: string;
  defaultSelectedKey?: string;
  onSelectionChange?: (key: string) => void;
  isDisabled?: boolean;
  isRequired?: boolean;
}

/** Finestra: barra del titolo, menu, corpo, barra di stato. */
export interface WindowProps {
  title: string;
  icon?: IconName;
  isActive?: boolean;
  isMaximized?: boolean;
  variant?: 'app' | 'document';
  controls?: Array<'minimize' | 'maximize' | 'close'>;
  onMinimize?: () => void;
  onToggleMaximize?: () => void;
  onClose?: () => void;
  menu?: React.ReactNode;
  statusBar?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface MenuBarProps { label?: string; children?: React.ReactNode }
export interface MenuButtonProps { label: React.ReactNode; icon?: IconName; children?: React.ReactNode }
export interface MenuItemProps { id?: string; shortcut?: string; icon?: IconName; isDisabled?: boolean; onAction?: () => void; children?: React.ReactNode }

export interface TabsProps {
  label?: string;
  tabs: Array<{ id: string; label: string; content: React.ReactNode; isDisabled?: boolean }>;
  selectedKey?: string;
  defaultSelectedKey?: string;
  onSelectionChange?: (key: string) => void;
}

export interface TooltipProps { text: string; children: React.ReactElement; delay?: number; placement?: 'top' | 'bottom' | 'start' | 'end' }

export interface ScrollAreaProps { label?: string; children?: React.ReactNode; className?: string; style?: React.CSSProperties }

export interface ProgressBarProps { label: string; value?: number; isIndeterminate?: boolean; valueLabel?: string }

export interface GroupBoxProps { legend: string; children?: React.ReactNode }

export interface StatusBarProps { fields: Array<{ text: React.ReactNode; grow?: boolean }>; label?: string }

export interface TaskbarProps { clock?: string; label?: string; children?: React.ReactNode }
export interface TaskbarButtonProps { icon?: IconName; isSelected?: boolean; defaultSelected?: boolean; onChange?: (isSelected: boolean) => void; isDisabled?: boolean; children?: React.ReactNode }
export interface StartButtonProps { children?: React.ReactNode }

export interface DesktopItem { id: string; label: string; icon: IconName }
export interface DesktopIconProps { items: DesktopItem[]; onAction?: (id: string) => void; label?: string; defaultSelectedKeys?: string[] }

export interface AlertDialogProps {
  title: string;
  kind?: 'warning' | 'error' | 'info';
  message: React.ReactNode;
  primaryLabel?: string;
  secondaryLabel?: string;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  onPrimary?: () => void;
}

export interface IconProps { name: IconName; size?: 16 | 32; scale?: 1 | 2 | 3; label?: string; className?: string }

export declare const Button: React.FC<ButtonProps>;
export declare const TextField: React.FC<TextFieldProps>;
export declare const TextArea: React.FC<TextAreaProps>;
export declare const Checkbox: React.FC<CheckboxProps>;
export declare const RadioGroup: React.FC<RadioGroupProps>;
export declare const Radio: React.FC<RadioProps>;
export declare const Select: React.FC<SelectProps>;
export declare const Window: React.FC<WindowProps>;
export declare const MenuBar: React.FC<MenuBarProps>;
export declare const MenuButton: React.FC<MenuButtonProps>;
export declare const MenuItem: React.FC<MenuItemProps>;
export declare const MenuSeparator: React.FC;
export declare const Tabs: React.FC<TabsProps>;
export declare const Tooltip: React.FC<TooltipProps>;
export declare const ScrollArea: React.FC<ScrollAreaProps>;
export declare const ProgressBar: React.FC<ProgressBarProps>;
export declare const GroupBox: React.FC<GroupBoxProps>;
export declare const StatusBar: React.FC<StatusBarProps>;
export declare const Taskbar: React.FC<TaskbarProps>;
export declare const TaskbarButton: React.FC<TaskbarButtonProps>;
export declare const StartButton: React.FC<StartButtonProps>;
export declare const DesktopIcons: React.FC<DesktopIconProps>;
export declare const AlertDialog: React.FC<AlertDialogProps>;
export declare const Icon: React.FC<IconProps>;
export declare const Glyph: React.FC<{ name: GlyphName; className?: string }>;
