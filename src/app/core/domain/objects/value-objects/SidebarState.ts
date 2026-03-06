import { EnumVo } from '@/app';

type SidebarStateValue =
    | typeof SidebarState.expanded
    | typeof SidebarState.collapsed;

export class SidebarState extends EnumVo<SidebarStateValue> {

    static expanded = 'expanded' as const;
    static collapsed = 'collapsed' as const;

    static _permittedValues  = [SidebarState.expanded, SidebarState.collapsed] as const;

    isCollapsed(): boolean
    {
        return this.value === SidebarState.collapsed;
    }

    isExpanded(): boolean
    {
        return this.value === SidebarState.expanded;
    }

    static fromBoolean(isCollapsed: boolean): SidebarState
    {
        return SidebarState.from(isCollapsed ? SidebarState.collapsed : SidebarState.expanded);
    }
}
