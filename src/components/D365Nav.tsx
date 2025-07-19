// src/components/D365Nav.tsx
import { useState } from 'react';
import { Icon } from '@fluentui/react';
import './D365Nav.css';

interface NavItem {
  name: string;
  key: string;
  url?: string;
  icon?: string;
  isSelected?: boolean;
  children?: NavItem[];
}

interface NavGroup {
  name?: string;
  items: NavItem[];
}

interface D365NavProps {
  groups: NavGroup[];
  selectedKey?: string;
  onLinkClick?: (key: string) => void;
}

export default function D365Nav({ groups, selectedKey, onLinkClick }: D365NavProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (key: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedItems(newExpanded);
  };

  const handleItemClick = (item: NavItem) => {
    if (item.children) {
      toggleExpanded(item.key);
    } else if (item.url && onLinkClick) {
      onLinkClick(item.key);
    }
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const isExpanded = expandedItems.has(item.key);
    const isSelected = selectedKey === item.key;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.key} className="d365-nav-item-container">
        <div
          className={`d365-nav-item ${isSelected ? 'selected' : ''} ${level > 0 ? 'child' : ''}`}
          onClick={() => handleItemClick(item)}
        >
          <div className="d365-nav-item-content">
            {item.icon && (
              <Icon
                iconName={item.icon}
                className="d365-nav-icon"
              />
            )}
            <span className="d365-nav-text">{item.name}</span>
          </div>
          {hasChildren && (
            <Icon
              iconName="ChevronDown"
              className="d365-nav-chevron"
              style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="d365-nav-children">
            {item.children!.map((child) => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="d365-navigation">
      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="d365-nav-group">
          {group.name && (
            <div className="d365-nav-group-header">
              {group.name}
            </div>
          )}
          <div className="d365-nav-group-items">
            {group.items.map((item) => renderNavItem(item))}
          </div>
        </div>
      ))}
    </nav>
  );
}
