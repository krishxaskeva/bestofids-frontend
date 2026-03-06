/**
 * Ant Design theme for Admin Panel – matches main website brand.
 * Primary: #117574 (teal) from sass/default/_color_variable.scss
 */
const ADMIN_PRIMARY = '#117574';
const ADMIN_PRIMARY_HOVER = '#0d5f5c';
const ADMIN_PRIMARY_ACTIVE = '#0a4d4a';
const ADMIN_CARD_RADIUS = 12;
const ADMIN_BTN_RADIUS = 10;

export const adminTheme = {
  token: {
    colorPrimary: ADMIN_PRIMARY,
    colorPrimaryHover: ADMIN_PRIMARY_HOVER,
    colorPrimaryActive: ADMIN_PRIMARY_ACTIVE,
    borderRadius: ADMIN_BTN_RADIUS,
    colorLink: ADMIN_PRIMARY,
    colorLinkHover: ADMIN_PRIMARY_HOVER,
    colorText: '#3d4f5c',
    colorTextSecondary: '#6b7c85',
  },
  components: {
    Button: {
      primaryShadow: `0 2px 8px rgba(17, 117, 116, 0.25)`,
      borderRadius: ADMIN_BTN_RADIUS,
      defaultBorderColor: ADMIN_PRIMARY,
      defaultColor: ADMIN_PRIMARY,
      defaultHoverColor: '#fff',
      defaultHoverBorderColor: ADMIN_PRIMARY,
      defaultHoverBg: ADMIN_PRIMARY,
    },
    Input: {
      activeBorderColor: ADMIN_PRIMARY,
      hoverBorderColor: ADMIN_PRIMARY,
      activeShadow: `0 0 0 2px rgba(17, 117, 116, 0.15)`,
    },
    Card: {
      borderRadiusLG: ADMIN_CARD_RADIUS,
    },
    Table: {
      headerBg: '#f0f2f5',
      rowHoverBg: 'rgba(17, 117, 116, 0.06)',
    },
    Menu: {
      darkItemBg: ADMIN_PRIMARY,
      darkItemSelectedBg: ADMIN_PRIMARY_ACTIVE,
      darkItemHoverBg: ADMIN_PRIMARY_HOVER,
      darkItemSelectedColor: '#fff',
      darkItemColor: 'rgba(255,255,255,0.9)',
    },
  },
};

export default adminTheme;
