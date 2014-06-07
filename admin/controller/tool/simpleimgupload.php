<?php 
class ControllerToolSimpleImgUpload extends Controller {
	private $error = array();

	public function upload() {
		$this->language->load('common/filemanager');

		$json = array();

		if (isset($this->request->post['directory'])) {
			if (isset($this->request->files['image']) && $this->request->files['image']['tmp_name']) {
				$filename = basename(html_entity_decode($this->request->files['image']['name'], ENT_QUOTES, 'UTF-8'));
				if (isset($this->request->post['newFileName'])){
					$filename = basename(html_entity_decode($this->request->post['newFileName'], ENT_QUOTES, 'UTF-8'));
				}
				if ((strlen($filename) < 3) || (strlen($filename) > 255)) {
					$json['error'] = $this->language->get('error_filename');
				}

				$directory = rtrim(DIR_IMAGE . 'data/' . str_replace('../', '', $this->request->post['directory']), '/');

				if (!is_dir($directory)) {
					$json['error'] = $this->language->get('error_directory');
				}

				if ($this->request->files['image']['size'] > 300000) {
					$json['error'] = $this->language->get('error_file_size');
				}

				$allowed = array(
					'image/jpeg',
					'image/pjpeg',
					'image/png',
					'image/x-png',
					'image/gif',
					'application/x-shockwave-flash'
				);

				if (!in_array($this->request->files['image']['type'], $allowed)) {
					$json['error'] = $this->language->get('error_file_type');
				}

				$allowed = array(
					'.jpg',
					'.jpeg',
					'.gif',
					'.png',
					'.flv'
				);

				if (!in_array(strtolower(strrchr($filename, '.')), $allowed)) {
					$json['error'] = $this->language->get('error_file_type');
				}

				if ($this->request->files['image']['error'] != UPLOAD_ERR_OK) {
					$json['error'] = 'error_upload_' . $this->request->files['image']['error'];
				}
			} else {
				$json['error'] = $this->language->get('error_file');
			}
		} else {
			$json['error'] = $this->language->get('error_directory');
		}

		if (!$this->user->hasPermission('modify', 'tool/simpleimgupload')) {
			$json['error'] = $this->language->get('error_permission');
		}

		if (!isset($json['error'])) {
			if (@move_uploaded_file($this->request->files['image']['tmp_name'], $directory . '/' . $filename)) {
				$json['success'] = $this->language->get('text_uploaded');
			} else {
				$json['error'] = $this->language->get('error_uploaded');
			}
		}

		$this->response->setOutput(json_encode($json));
	}

	public function index() {
	}

}