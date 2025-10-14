"""
Email service using SMTP
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from app.core.config import settings

class EmailService:
    def __init__(self):
        self.smtp_server = settings.smtp_server
        self.smtp_port = settings.smtp_port
        self.smtp_username = settings.smtp_username
        self.smtp_password = settings.smtp_password
        self.smtp_use_tls = settings.smtp_use_tls
        self.from_email = settings.smtp_from_email or settings.smtp_username
    
    def _send_email(self, to_email: str, subject: str, html_content: str, text_content: str = None) -> bool:
        """Send email using SMTP"""
        try:
            if not all([self.smtp_server, self.smtp_username, self.smtp_password]):
                print("⚠️ SMTP configuration incomplete - using fallback method")
                return self._send_fallback_email(to_email, subject, html_content, text_content)
            
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.from_email
            msg['To'] = to_email
            
            # Add text content
            if text_content:
                text_part = MIMEText(text_content, 'plain')
                msg.attach(text_part)
            
            # Add HTML content
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            # Connect to SMTP server
            print(f"🔗 Connecting to SMTP server: {self.smtp_server}:{self.smtp_port}")
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            
            if self.smtp_use_tls:
                server.starttls()
                print("🔒 TLS encryption enabled")
            
            # Login
            server.login(self.smtp_username, self.smtp_password)
            print(f"✅ Successfully logged in as {self.smtp_username}")
            
            # Send email
            server.send_message(msg)
            server.quit()
            
            print(f"✅ Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            print(f"❌ SMTP Error: {e}")
            print("⚠️ Falling back to console display")
            return self._send_fallback_email(to_email, subject, html_content, text_content)
    
    def send_verification_email(self, to_email: str, user_name: str, verification_token: str) -> bool:
        """Send verification email to user"""
        try:
            verification_link = f"http://localhost:8000/auth/verify?token={verification_token}"
            
            subject = "Welcome to Shadiejo - Verify Your Email"
            
            html_content = f"""
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #007bff; margin: 0;">Welcome to Shadiejo!</h1>
                    </div>
                    
                    <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Hi {user_name},</p>
                    
                    <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                        Thank you for signing up with Shadiejo! To complete your registration, 
                        please verify your email address by clicking the button below:
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{verification_link}" 
                           style="background-color: #007bff; color: white; padding: 15px 30px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block; 
                                  font-weight: bold; font-size: 16px;">
                            Verify Email Address
                        </a>
                    </div>
                    
                    <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
                        If the button doesn't work, you can copy and paste this link into your browser:
                    </p>
                    
                    <p style="word-break: break-all; color: #007bff; background-color: #e9ecef; 
                              padding: 10px; border-radius: 5px; font-family: monospace; font-size: 12px;">
                        {verification_link}
                    </p>
                    
                    <p style="font-size: 14px; color: #666; margin-top: 30px;">
                        This link will expire in 24 hours.
                    </p>
                    
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
                    
                    <p style="font-size: 12px; color: #6c757d; text-align: center;">
                        If you didn't create an account with Shadiejo, please ignore this email.
                    </p>
                </div>
            </body>
            </html>
            """
            
            text_content = f"""
            Welcome to Shadiejo!
            
            Hi {user_name},
            
            Thank you for signing up with Shadiejo! To complete your registration, 
            please verify your email address by visiting this link:
            
            {verification_link}
            
            This link will expire in 24 hours.
            
            If you didn't create an account with Shadiejo, please ignore this email.
            """
            
            return self._send_email(to_email, subject, html_content, text_content)
            
        except Exception as e:
            print(f"❌ Error sending verification email: {e}")
            return False
    
    def send_welcome_email(self, to_email: str, user_name: str) -> bool:
        """Send welcome email after successful verification"""
        try:
            subject = "Welcome to Shadiejo - Account Verified!"
            
            html_content = f"""
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #28a745; margin: 0;">🎉 Account Verified!</h1>
                    </div>
                    
                    <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Hi {user_name},</p>
                    
                    <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                        Your email has been successfully verified! You can now access all features of Shadiejo.
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:8000/dashboard" 
                           style="background-color: #28a745; color: white; padding: 15px 30px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block; 
                                  font-weight: bold; font-size: 16px;">
                            Go to Dashboard
                        </a>
                    </div>
                    
                    <p style="font-size: 16px; color: #333; margin-top: 30px;">
                        Thank you for choosing Shadiejo!
                    </p>
                </div>
            </body>
            </html>
            """
            
            text_content = f"""
            Account Verified!
            
            Hi {user_name},
            
            Your email has been successfully verified! You can now access all features of Shadiejo.
            
            Login here: http://localhost:8000/dashboard
            
            Thank you for choosing Shadiejo!
            """
            
            return self._send_email(to_email, subject, html_content, text_content)
            
        except Exception as e:
            print(f"❌ Error sending welcome email: {e}")
            return False
    
    def _send_fallback_email(self, to_email: str, subject: str, html_content: str, text_content: str = None) -> bool:
        """Fallback email method when SMTP is not available"""
        try:
            print("=" * 60)
            print("📧 FALLBACK EMAIL")
            print("=" * 60)
            print(f"To: {to_email}")
            print(f"Subject: {subject}")
            print("")
            if text_content:
                print(text_content)
            else:
                print("HTML content would be displayed here")
            print("=" * 60)
            print("✅ Fallback email 'sent' (displayed in console)")
            print("=" * 60)
            
            return True
        except Exception as e:
            print(f"❌ Error in fallback email: {e}")
            return False

# Create global email service instance
email_service = EmailService()