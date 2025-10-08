"""
Test email functionality
"""

import pytest
from unittest.mock import patch, MagicMock
from app.services.email import EmailService

def test_email_service_initialization():
    """Test email service can be initialized"""
    email_service = EmailService()
    assert email_service.api_url == "https://api.nodemailer.com"
    assert email_service.credentials is None

@patch('requests.post')
def test_get_credentials_success(mock_post):
    """Test getting credentials from Nodemailer API"""
    # Mock successful response
    mock_response = MagicMock()
    mock_response.json.return_value = {"api_key": "test_key", "user_id": "test_user"}
    mock_response.raise_for_status.return_value = None
    mock_post.return_value = mock_response
    
    email_service = EmailService()
    credentials = email_service.get_credentials()
    
    assert credentials == {"api_key": "test_key", "user_id": "test_user"}
    assert email_service.credentials == {"api_key": "test_key", "user_id": "test_user"}

@patch('requests.post')
def test_send_verification_email_success(mock_post):
    """Test sending verification email"""
    # Mock credentials response
    mock_credentials_response = MagicMock()
    mock_credentials_response.json.return_value = {"api_key": "test_key"}
    mock_credentials_response.raise_for_status.return_value = None
    
    # Mock email send response
    mock_send_response = MagicMock()
    mock_send_response.status_code = 200
    
    mock_post.side_effect = [mock_credentials_response, mock_send_response]
    
    email_service = EmailService()
    result = email_service.send_verification_email(
        to_email="test@example.com",
        user_name="Test User",
        verification_token="test_token"
    )
    
    assert result is True
    assert mock_post.call_count == 2

@patch('requests.post')
def test_send_verification_email_failure(mock_post):
    """Test sending verification email failure"""
    # Mock credentials response
    mock_credentials_response = MagicMock()
    mock_credentials_response.json.return_value = {"api_key": "test_key"}
    mock_credentials_response.raise_for_status.return_value = None
    
    # Mock email send failure
    mock_send_response = MagicMock()
    mock_send_response.status_code = 400
    mock_send_response.text = "Bad Request"
    
    mock_post.side_effect = [mock_credentials_response, mock_send_response]
    
    email_service = EmailService()
    result = email_service.send_verification_email(
        to_email="test@example.com",
        user_name="Test User",
        verification_token="test_token"
    )
    
    assert result is False
