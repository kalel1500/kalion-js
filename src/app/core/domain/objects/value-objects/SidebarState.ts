import { EnumVo } from '@/app';

export class SidebarState extends EnumVo<'expanded' | 'collapsed'> {

    static expanded: 'expanded' = 'expanded';
    static collapsed: 'collapsed' = 'collapsed';

    protected _permittedValues = [SidebarState.expanded, SidebarState.collapsed];

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
