// src/constants/permissions.ts

export const PERMISSIONS = {
    // 🚛 Fleets App
    FLEETS: {
      VIEW_NAVYTYPE: "fleets.view_navytype",
      ADD_NAVYTYPE: "fleets.add_navytype",
      CHANGE_NAVYTYPE: "fleets.change_navytype",
      DELETE_NAVYTYPE: "fleets.delete_navytype",
  
      VIEW_NAVYSIZE: "fleets.view_navysize",
      ADD_NAVYSIZE: "fleets.add_navysize",
      CHANGE_NAVYSIZE: "fleets.change_navysize",
      DELETE_NAVYSIZE: "fleets.delete_navysize",
  
      VIEW_NAVYBRAND: "fleets.view_navybrand",
      ADD_NAVYBRAND: "fleets.add_navybrand",
      CHANGE_NAVYBRAND: "fleets.change_navybrand",
      DELETE_NAVYBRAND: "fleets.delete_navybrand",
  
      VIEW_NAVYMAIN: "fleets.view_navymain",
      ADD_NAVYMAIN: "fleets.add_navymain",
      CHANGE_NAVYMAIN: "fleets.change_navymain",
      DELETE_NAVYMAIN: "fleets.delete_navymain",
    },
  
    // 👥 Accounts App
    ACCOUNTS: {
      VIEW_USER: "accounts.view_user",
      ADD_USER: "accounts.add_user",
      CHANGE_USER: "accounts.change_user",
      DELETE_USER: "accounts.delete_user",
    },
  
    // 🌍 Regions App
    REGIONS: {
      VIEW_PROVINCE: "regions.view_province",
      ADD_PROVINCE: "regions.add_province",
      CHANGE_PROVINCE: "regions.change_province",
      DELETE_PROVINCE: "regions.delete_province",
  
      VIEW_CITY: "regions.view_city",
      ADD_CITY: "regions.add_city",
      CHANGE_CITY: "regions.change_city",
      DELETE_CITY: "regions.delete_city",
  
      VIEW_ACTIVITYAREA: "regions.view_activityarea",
      ADD_ACTIVITYAREA: "regions.add_activityarea",
      CHANGE_ACTIVITYAREA: "regions.change_activityarea",
      DELETE_ACTIVITYAREA: "regions.delete_activityarea",
    },
  
    // ⚙️ Auth App
    AUTH: {
      VIEW_PERMISSION: "auth.view_permission",
      ADD_PERMISSION: "auth.add_permission",
      CHANGE_PERMISSION: "auth.change_permission",
      DELETE_PERMISSION: "auth.delete_permission",
  
      VIEW_GROUP: "auth.view_group",
      ADD_GROUP: "auth.add_group",
      CHANGE_GROUP: "auth.change_group",
      DELETE_GROUP: "auth.delete_group",
    },
  
    // 🧪 Usages App
    USAGES: {
      VIEW_USAGETYPE: "usages.view_usagetype",
      ADD_USAGETYPE: "usages.add_usagetype",
      CHANGE_USAGETYPE: "usages.change_usagetype",
      DELETE_USAGETYPE: "usages.delete_usagetype",
    },
  
    // 🏭 Sectors App
    SECTORS: {
      VIEW_ACTIVITYCATEGORY: "sectors.view_activitycategory",
      ADD_ACTIVITYCATEGORY: "sectors.add_activitycategory",
      CHANGE_ACTIVITYCATEGORY: "sectors.change_activitycategory",
      DELETE_ACTIVITYCATEGORY: "sectors.delete_activitycategory",
    },
  
    // 🕓 Sessions App
    SESSIONS: {
      VIEW_SESSION: "sessions.view_session",
      ADD_SESSION: "sessions.add_session",
      CHANGE_SESSION: "sessions.change_session",
      DELETE_SESSION: "sessions.delete_session",
    },
  
    // 🧩 ContentTypes
    CONTENTTYPES: {
      VIEW: "contenttypes.view_contenttype",
      ADD: "contenttypes.add_contenttype",
      CHANGE: "contenttypes.change_contenttype",
      DELETE: "contenttypes.delete_contenttype",
    },
  
    // 🛠 Admin Logs
    ADMIN: {
      VIEW_LOGENTRY: "admin.view_logentry",
      ADD_LOGENTRY: "admin.add_logentry",
      CHANGE_LOGENTRY: "admin.change_logentry",
      DELETE_LOGENTRY: "admin.delete_logentry",
    },
  };
  

/**
 * بررسی می‌کند که آیا کاربر یک یا چند دسترسی خاص را دارد یا نه
 * 
 * @param userPermissions - آرایه‌ای از دسترسی‌های فعلی کاربر (از سرور گرفته شده)
 * @param required - یک دسترسی خاص یا آرایه‌ای از دسترسی‌ها
 * @returns true اگر کاربر همه دسترسی‌ها را داشته باشد، false در غیر این صورت
 */
export const hasPermission = (
    userPermissions: string[],
    required: string | string[]
  ): boolean => {
    if (Array.isArray(required)) {
      return required.every((perm) => userPermissions.includes(perm));
    }
    return userPermissions.includes(required);
  };