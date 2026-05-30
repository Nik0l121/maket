import React from "react";

export interface Signal {
  id: number;
  pair: string;
  network: string;
  spread: string;
  profit: string;
  buyPrice: string;
  sellPrice: string;
  buyDex: string;
  sellDex: string;
  status: string;
  type: string;
}

export interface HeaderNav {
  name: string;
  icon: React.ReactNode;
}

export interface NavItem {
  name: string;
  icon: React.ReactNode;
}

export interface NotificationItem {
  id: string;
  time: string;
  status: "новое" | "прочитано";
  title: string;
  subtitle: string;
  source: string;
  value: string;
  valueColor: "green" | "red" | "purple" | "blue";
  priority: "NEW" | "READ" | "СИСТЕМА";
  channel: string;
  group: "Сигналы" | "Арбитраж" | "События исполнения" | "Система";
  colorIndicator: string;
  detailedText: string;
  parameters: {
    name: string;
    value: string;
    tagStyle?: string;
  }[];
}

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};
