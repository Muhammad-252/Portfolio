# WordPress Integration Blueprint for Projects & Filters

If you wish to manage your projects and taxonomies directly from a **WordPress Admin Panel** (as a headless CMS feeding this Next.js portfolio or as a standalone WordPress site), use the configuration below in your WordPress theme's `functions.php` or as a custom WordPress plugin.

---

## 1. WordPress `functions.php` Code

Add this code to your WordPress active theme's `functions.php` or a dedicated mu-plugin:

```php
<?php
/**
 * Plugin / Theme Functions: Arslan Portfolio Project Management System
 * Registers Custom Post Type 'portfolio_project' with:
 *  1. Main Category (UI/UX Design, WordPress, Webflow)
 *  2. Dynamic Industry (Real Estate, Healthcare, FinTech, etc.)
 *  3. Platform / Project Type (Website, Web App, Mobile App)
 *  4. REST API & Gutenberg support
 */

function arslan_register_portfolio_cpt() {
    // 1. Register Custom Post Type: Portfolio
    $labels = array(
        'name'                  => 'Projects',
        'singular_name'         => 'Project',
        'menu_name'             => 'Portfolio Projects',
        'name_admin_bar'        => 'Project',
        'add_new'               => 'Add New Project',
        'add_new_item'          => 'Add New Project',
        'new_item'              => 'New Project',
        'edit_item'             => 'Edit Project',
        'view_item'             => 'View Project',
        'all_items'             => 'All Projects',
        'search_items'          => 'Search Projects',
        'not_found'             => 'No projects found.',
    );

    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => true,
        'rewrite'            => array('slug' => 'work'),
        'capability_type'    => 'post',
        'has_archive'        => true,
        'hierarchical'       => false,
        'menu_position'      => 5,
        'menu_icon'          => 'dashicons-portfolio',
        'supports'           => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
        'show_in_rest'       => true, // Required for REST API & Block Editor
        'rest_base'          => 'projects',
    );

    register_post_type('portfolio_project', $args);

    // 2. Taxonomy: Main Category (UI/UX Design, WordPress, Webflow)
    register_taxonomy('project_main_category', 'portfolio_project', array(
        'labels' => array(
            'name'          => 'Main Categories',
            'singular_name' => 'Main Category',
            'search_items'  => 'Search Main Categories',
            'all_items'     => 'All Main Categories',
            'edit_item'     => 'Edit Main Category',
            'update_item'   => 'Update Main Category',
            'add_new_item'  => 'Add New Main Category',
            'new_item_name' => 'New Main Category Name',
            'menu_name'     => 'Main Categories',
        ),
        'hierarchical'      => true, // behaves like standard category checkboxes
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'show_in_rest'      => true,
        'rewrite'           => array('slug' => 'project-category'),
    ));

    // 3. Taxonomy: Dynamic Industry (Editable directly in WP Admin > Projects > Industries)
    register_taxonomy('project_industry', 'portfolio_project', array(
        'labels' => array(
            'name'          => 'Industries',
            'singular_name' => 'Industry',
            'search_items'  => 'Search Industries',
            'all_items'     => 'All Industries',
            'edit_item'     => 'Edit Industry',
            'update_item'   => 'Update Industry',
            'add_new_item'  => 'Add New Industry',
            'new_item_name' => 'New Industry Name',
            'menu_name'     => 'Industries',
        ),
        'hierarchical'      => true, // Hierarchical so admin can add, edit, or delete industries dynamically
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'show_in_rest'      => true,
        'rewrite'           => array('slug' => 'industry'),
    ));

    // 4. Taxonomy: Platform / Project Type (Website, Web App, Mobile App)
    register_taxonomy('project_platform', 'portfolio_project', array(
        'labels' => array(
            'name'          => 'Platforms / Types',
            'singular_name' => 'Platform',
            'search_items'  => 'Search Platforms',
            'all_items'     => 'All Platforms',
            'edit_item'     => 'Edit Platform',
            'update_item'   => 'Update Platform',
            'add_new_item'  => 'Add New Platform',
            'new_item_name' => 'New Platform Name',
            'menu_name'     => 'Platforms / Types',
        ),
        'hierarchical'      => false, // Can be radio/tags
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'show_in_rest'      => true,
        'rewrite'           => array('slug' => 'platform'),
    ));
}
add_action('init', 'arslan_register_portfolio_cpt');

/**
 * Pre-populate initial default terms for WordPress
 */
function arslan_insert_default_terms() {
    // Default Main Categories
    $main_cats = array('UI/UX Design', 'WordPress', 'Webflow');
    foreach ($main_cats as $cat) {
        if (!term_exists($cat, 'project_main_category')) {
            wp_insert_term($cat, 'project_main_category');
        }
    }

    // Default Industries
    $industries = array(
        'Real Estate', 'Healthcare', 'Education & Training', 'E-commerce',
        'FinTech', 'SaaS', 'Food & Restaurant', 'Sports & Fitness',
        'Travel & Tourism', 'Logistics', 'Retail', 'Construction', 'Media & Entertainment'
    );
    foreach ($industries as $ind) {
        if (!term_exists($ind, 'project_industry')) {
            wp_insert_term($ind, 'project_industry');
        }
    }

    // Default Platforms
    $platforms = array('Website', 'Web App', 'Mobile App');
    foreach ($platforms as $plat) {
        if (!term_exists($plat, 'project_platform')) {
            wp_insert_term($plat, 'project_platform');
        }
    }
}
add_action('after_switch_theme', 'arslan_insert_default_terms');
```

---

## 2. WordPress Admin Usage

Once registered:
1. Navigate to **WP Admin > Portfolio Projects**.
2. Click **Industries** in the left submenu:
   - Add new industries as your client roster grows.
   - Edit, rename, or delete existing industries.
3. When creating or editing any **Project**:
   - Set **Project Title**.
   - Select **Main Category** (`UI/UX Design`, `WordPress`, or `Webflow`).
   - Select **Industry** from your dynamically managed list.
   - Select **Platform** (`Website`, `Web App`, `Mobile App`).
   - Set **Featured Image** (Project Image).
   - Fill in Project Details / Case Study in the content area or ACF fields.

---

## 3. WordPress REST API Endpoint

This makes your WordPress backend accessible to Next.js via:

```http
GET https://your-wordpress-domain.com/wp-json/wp/v2/projects?_embed
```

Response items include:
- `title.rendered`
- `project_main_category` (term IDs/names)
- `project_industry` (term IDs/names)
- `project_platform` (term IDs/names)
- `_embedded['wp:featuredmedia'][0].source_url` (Project Image)
- `content.rendered` (Case study content)

---

## 4. Blog Posts Management (WordPress Standard REST API)

WordPress already includes a first-class blog system via standard `post` types:

1. In **WP Admin > Posts**:
   - **Add New Post**: Write article content, set title, excerpt, featured image, categories, and tags.
   - **Categories**: Create categories such as `UI/UX Strategy`, `Design Systems`, `Prototyping`, `Case Analysis`, `Career & Process`.
2. REST API endpoint used by the Next.js frontend:
   ```http
   GET https://your-wordpress-domain.com/wp-json/wp/v2/posts?_embed
   ```
3. To enable custom reading time in the REST API, add this helper to `functions.php`:
   ```php
   register_rest_field('post', 'reading_time', array(
       'get_callback' => function($post) {
           $word_count = str_word_count(strip_tags($post['content']['rendered']));
           $minutes = ceil($word_count / 200);
           return $minutes . ' min read';
       }
   ));
   ```

---

## 5. Frequently Asked Questions (FAQ) Custom Post Type

Add this code to `functions.php` to register `portfolio_faq` with categories and ordering:

```php
function arslan_register_faq_cpt() {
    register_post_type('portfolio_faq', array(
        'labels' => array(
            'name'          => 'FAQs',
            'singular_name' => 'FAQ',
            'menu_name'     => 'Client FAQs',
            'add_new_item'  => 'Add New FAQ',
            'edit_item'     => 'Edit FAQ',
            'all_items'     => 'All FAQs',
        ),
        'public'       => true,
        'show_in_rest' => true,
        'rest_base'    => 'faqs',
        'menu_icon'    => 'dashicons-editor-help',
        'supports'     => array('title', 'editor', 'page-attributes', 'custom-fields'),
    ));

    register_taxonomy('faq_category', 'portfolio_faq', array(
        'labels' => array(
            'name'          => 'FAQ Categories',
            'singular_name' => 'FAQ Category',
        ),
        'hierarchical' => true,
        'show_in_rest' => true,
    ));
}
add_action('init', 'arslan_register_faq_cpt');
```

REST API Endpoint:
```http
GET https://your-wordpress-domain.com/wp-json/wp/v2/faqs
```

