"use client";

import React, { useState } from "react";
import { Button, Input, Checkbox, Link, Divider, Form, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { SunGroupIcon } from "@/components/icons";
import { useTranslation } from "@/lib/i18n-context";
import { useAuth } from "@/hooks/use-auth";
import { useSuccessToast, useErrorToast } from "@/components/toast";
import { DEMO_ACCOUNTS } from "@/stores/auth-store";
import type { LoginCredentials } from "@/stores/auth-store";

export default function LoginPage() {
  const { t } = useTranslation();
  const { login, isLoggingIn, error, clearError } = useAuth();
  const navigate = useNavigate();
  const showSuccess = useSuccessToast();
  const showError = useErrorToast();
  
  const [isVisible, setIsVisible] = useState(false);
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearError();

    try {
      await login(credentials);
      showSuccess(t('auth.loginSuccess'), t('auth.welcomeBack'));
      navigate("/dashboard");
    } catch (error) {
      showError(t('auth.loginError'), error instanceof Error ? error.message : t('auth.invalidCredentials'));
    }
  };

  const handleDemoLogin = async (email: string, password: string) => {
    setCredentials({ email, password });
    clearError();

    try {
      await login({ email, password });
      showSuccess(t('auth.loginSuccess'), t('auth.welcomeBack'));
      navigate("/dashboard");
    } catch (error) {
      showError(t('auth.loginError'), error instanceof Error ? error.message : t('auth.invalidCredentials'));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: 0.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="rounded-small bg-content1 flex min-h-screen w-full items-center justify-end overflow-hidden p-2 sm:p-4 lg:p-8"
      style={{
        backgroundImage:
          "url(https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/black-background-texture.jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Brand Logo */}
      <motion.div
        className="absolute top-10 left-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center gap-3">
          <SunGroupIcon className="text-white drop-shadow-lg" size={48} />
          <div className="flex flex-col">
            <p className="font-bold text-white text-2xl leading-none drop-shadow-lg">SUN</p>
            <p className="font-semibold text-sun-gold-200 text-sm leading-none drop-shadow-lg">GROUP</p>
          </div>
        </div>
      </motion.div>

      {/* Testimonial */}
      <motion.div 
        className="absolute bottom-10 left-10 hidden md:block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <p className="max-w-xl text-white/60">
          <span className="font-medium">"</span>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget augue nec massa
          volutpat aliquet.
          <span className="font-medium">"</span>
        </p>
      </motion.div>

      {/* Demo Credentials Card */}
      <motion.div
        className="absolute top-10 left-1/2 transform -translate-x-1/2 hidden lg:block z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="w-96 bg-content1/95 backdrop-blur-sm shadow-lg border border-sun-gold-200/30">
          <CardBody className="p-4">
            <h3 className="text-lg font-semibold mb-3 text-center">{t('auth.demoCredentials')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DEMO_ACCOUNTS.map((account) => (
                <div key={account.email} className="p-3 bg-sun-gold-50/80 rounded-lg border border-sun-gold-200/50">
                  <div className="text-center mb-2">
                    <span className="font-medium text-sm">
                      {account.role === 'admin' ? t('auth.adminAccount') : t('auth.employeeAccount')}
                    </span>
                  </div>
                  <div className="text-center mb-2">
                    <p className="text-xs text-default-500">{account.email}</p>
                    <p className="text-xs text-default-500">{account.password}</p>
                  </div>
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    isLoading={isLoggingIn}
                    onPress={() => handleDemoLogin(account.email, account.password)}
                    className="w-full"
                  >
                    {t('auth.login')}
                  </Button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Login Form */}
      <motion.div 
        className="rounded-large bg-content1 shadow-small flex w-full max-w-sm flex-col gap-4 px-8 pt-6 pb-10"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <p className="pb-2 text-xl font-medium">{t('auth.login')}</p>
        
        {error && (
          <motion.div
            className="p-3 bg-danger-50 border border-danger-200 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-danger text-sm">{error}</p>
          </motion.div>
        )}
        
        <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={handleSubmit}>
          <Input
            isRequired
            label={t('auth.email')}
            name="email"
            placeholder={t('auth.enterEmail')}
            type="email"
            variant="bordered"
            value={credentials.email}
            onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
          />
          <Input
            isRequired
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="text-default-400 pointer-events-none text-2xl"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="text-default-400 pointer-events-none text-2xl"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label={t('auth.password')}
            name="password"
            placeholder={t('auth.enterPassword')}
            type={isVisible ? "text" : "password"}
            variant="bordered"
            value={credentials.password}
            onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
          />
          <div className="flex w-full items-center justify-between px-1 py-2">
            <Checkbox name="remember" size="sm">
              {t('auth.rememberMe')}
            </Checkbox>
            <Link className="text-default-500" href="#" size="sm">
              {t('auth.forgotPassword')}
            </Link>
          </div>
          <Button 
            className="w-full" 
            color="primary" 
            type="submit"
            isLoading={isLoggingIn}
          >
            {isLoggingIn ? t('auth.loggingIn') : t('auth.login')}
          </Button>
        </Form>
        <div className="flex items-center gap-4 py-2">
          <Divider className="flex-1" />
          <p className="text-tiny text-default-500 shrink-0">{t('auth.or')}</p>
          <Divider className="flex-1" />
        </div>
        <div className="flex flex-col gap-2">
          <Button
            startContent={<Icon icon="flat-color-icons:google" width={24} />}
            variant="bordered"
          >
            {t('auth.continueWithGoogle')}
          </Button>
          <Button
            startContent={<Icon className="text-default-500" icon="fe:github" width={24} />}
            variant="bordered"
          >
            {t('auth.continueWithGithub')}
          </Button>
        </div>
        <p className="text-small text-center">
          {t('auth.needAccount')}&nbsp;
          <Link href="#" size="sm">
            {t('auth.signUp')}
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}
