import { TabCaption, TabContainer } from "./styles";

import React from "react";

function Tabs(props: {
  children: React.ReactNode;
  grayBorder?: boolean;
  full?: boolean;
}) {
  return (
    <TabContainer
      {...props}
      $grayBorder={props.grayBorder}
      $full={props.full}
    />
  );
}

type TabTitleProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

function TabTitle(props: TabTitleProps) {
  return <TabCaption {...props} />;
}

export { Tabs, TabTitle };
