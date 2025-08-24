import { Button, Card, CardBody, CardHeader, Avatar, Chip } from "@heroui/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { title } from "@/components/primitives";
import { useTranslation } from "@/lib/i18n-context";
import { useAuth } from "@/hooks/use-auth";
import DefaultLayout from "@/layouts/default";

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <DefaultLayout>
      <motion.section 
        className="flex flex-col items-center justify-center gap-4 py-8 md:py-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="inline-block max-w-lg text-center justify-center"
          variants={itemVariants}
        >
          <h1 className={title()}>{t('common.dashboard')}</h1>
          <p className="text-lg text-default-600 mt-4">
            {t('auth.welcomeBack')}, {user.name}!
          </p>
        </motion.div>

        <motion.div 
          className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
          variants={itemVariants}
        >
          {/* User Profile Card */}
          <Card className="w-full">
            <CardHeader className="flex gap-3">
              <Avatar
                src={user.avatar}
                name={user.name}
                size="lg"
              />
              <div className="flex flex-col">
                <p className="text-md font-semibold">{user.name}</p>
                <p className="text-small text-default-500">{user.email}</p>
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{t('stores.users.role')}:</span>
                  <Chip
                    color="primary"
                    variant="flat"
                    size="sm"
                    className={isAdmin() ? "bg-sun-gold-100 text-sun-gold-800" : "bg-sun-blue-100 text-sun-blue-800"}
                  >
                    {isAdmin() ? t('auth.adminAccount') : t('auth.employeeAccount')}
                  </Chip>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{t('stores.users.status')}:</span>
                  <Chip color="success" variant="flat" size="sm">
                    {t('common.active')}
                  </Chip>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Quick Actions Card */}
          <Card className="w-full">
            <CardHeader>
              <h3 className="text-lg font-semibold">Quick Actions</h3>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col gap-3">
                {isAdmin() && (
                  <>
                    <Button
                      color="primary"
                      variant="flat"
                      className="justify-start"
                      onPress={() => navigate("/demo")}
                    >
                      {t('stores.users.title')} {t('common.dashboard')}
                    </Button>
                    <Button
                      color="secondary"
                      variant="flat"
                      className="justify-start"
                    >
                      {t('stores.products.title')} {t('common.dashboard')}
                    </Button>
                  </>
                )}
                <Button
                  color="default"
                  variant="flat"
                  className="justify-start"
                >
                  {t('common.settings')}
                </Button>
                <Button
                  color="danger"
                  variant="flat"
                  className="justify-start"
                  onPress={handleLogout}
                >
                  {t('auth.logout')}
                </Button>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Demo Information */}
        <motion.div 
          className="w-full max-w-4xl mt-8"
          variants={itemVariants}
        >
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">{t('auth.demoCredentials')}</h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-content2 rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">{t('auth.adminAccount')}</h4>
                  <p className="text-sm text-default-600">Email: admin@acme.com</p>
                  <p className="text-sm text-default-600">Password: admin123</p>
                  <p className="text-sm text-default-500 mt-2">Full access to all features</p>
                </div>
                <div className="p-4 bg-content2 rounded-lg">
                  <h4 className="font-semibold text-secondary mb-2">{t('auth.employeeAccount')}</h4>
                  <p className="text-sm text-default-600">Email: employee@acme.com</p>
                  <p className="text-sm text-default-600">Password: employee123</p>
                  <p className="text-sm text-default-500 mt-2">Limited access for employees</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </motion.section>
    </DefaultLayout>
  );
}
