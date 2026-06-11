import { default as AlertTri } from "./alertTri.svg";
import { default as ArrowLeft } from "./arrowLeft.svg";
import { default as ArrowRight } from "./arrowRight.svg";
import { default as Bell } from "./bell.svg";
import { default as Building } from "./building.svg";
import { default as Calendar } from "./calendar.svg";
import { default as Chart } from "./chart.svg";
import { default as Check } from "./check.svg";
import { default as CheckCircle } from "./checkCircle.svg";
import { default as ChevDown } from "./chevDown.svg";
import { default as ChevLeft } from "./chevLeft.svg";
import { default as ChevRight } from "./chevRight.svg";
import { default as Clipboard } from "./clipboard.svg";
import { default as Copy } from "./copy.svg";
import { default as Cpu } from "./cpu.svg";
import { default as Dashboard } from "./dashboard.svg";
import { default as Eye } from "./eye.svg";
import { default as EyeOff } from "./eyeOff.svg";
import { default as External } from "./external.svg";
import { default as File } from "./file.svg";
import { default as FileCheck } from "./fileCheck.svg";
import { default as Folder } from "./folder.svg";
import { default as Hash } from "./hash.svg";
import { default as Help } from "./help.svg";
import { default as Link } from "./link.svg";
import { default as Loader } from "./loader.svg";
import { default as Lock } from "./lock.svg";
import { default as Mail } from "./mail.svg";
import { default as MapPin } from "./mapPin.svg";
import { default as MoreV } from "./moreV.svg";
import { default as Orders } from "./orders.svg";
import { default as Pencil } from "./pencil.svg";
import { default as Phone } from "./phone.svg";
import { default as Plus } from "./plus.svg";
import { default as Refresh } from "./refresh.svg";
import { default as Save } from "./save.svg";
import { default as Search } from "./search.svg";
import { default as Settings } from "./settings.svg";
import { default as Shield } from "./shield.svg";
import { default as Tasks } from "./tasks.svg";
import { default as Trash } from "./trash.svg";
import { default as Upload } from "./upload.svg";
import { default as User } from "./user.svg";
import { default as X } from "./x.svg";

import type { FC, SVGProps } from "react";

export const ICONS: Record<string, FC<SVGProps<SVGSVGElement>>> = {
  alertTri: AlertTri,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  bell: Bell,
  building: Building,
  calendar: Calendar,
  chart: Chart,
  check: Check,
  checkCircle: CheckCircle,
  chevDown: ChevDown,
  chevLeft: ChevLeft,
  chevRight: ChevRight,
  clipboard: Clipboard,
  copy: Copy,
  cpu: Cpu,
  dashboard: Dashboard,
  eye: Eye,
  eyeOff: EyeOff,
  external: External,
  file: File,
  fileCheck: FileCheck,
  folder: Folder,
  hash: Hash,
  help: Help,
  link: Link,
  loader: Loader,
  lock: Lock,
  mail: Mail,
  mapPin: MapPin,
  moreV: MoreV,
  orders: Orders,
  pencil: Pencil,
  phone: Phone,
  plus: Plus,
  refresh: Refresh,
  save: Save,
  search: Search,
  settings: Settings,
  shield: Shield,
  tasks: Tasks,
  trash: Trash,
  upload: Upload,
  user: User,
  x: X,
};

export type IconName = keyof typeof ICONS;
