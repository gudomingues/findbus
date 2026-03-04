declare module 'google-map-react' {
  import * as React from 'react';

  export interface Props {
    bootstrapURLKeys?: {
      key: string;
      language?: string;
      region?: string;
      libraries?: string[];
    };
    center?: {
      lat: number;
      lng: number;
    };
    defaultCenter?: {
      lat: number;
      lng: number;
    };
    zoom?: number;
    defaultZoom?: number;
    options?: any;
    onChange?: (value: any) => void;
    onClick?: (value: any) => void;
    onChildClick?: (key: any, childProps: any) => void;
    onChildMouseEnter?: (key: any, childProps: any) => void;
    onChildMouseLeave?: (key: any, childProps: any) => void;
    yesIWantToUseGoogleMapApiInternals?: boolean;
    onGoogleApiLoaded?: (map: any) => void;
    children?: React.ReactNode;
  }

  export default class GoogleMapReact extends React.Component<Props> {}
}
